/**
 * HTTP layer for the Syncro MSP API
 */

import type { ResolvedConfig } from './config.js';
import type { RateLimiter } from './rate-limiter.js';
import {
  SyncroError,
  SyncroAuthenticationError,
  SyncroNotFoundError,
  SyncroValidationError,
  SyncroRateLimitError,
  SyncroServerError,
} from './errors.js';

/**
 * HTTP request options
 */
export interface RequestOptions {
  /** HTTP method */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /** Request body (will be JSON stringified) */
  body?: unknown;
  /** URL query parameters */
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * HTTP client for making authenticated requests to the Syncro MSP API
 */
export class HttpClient {
  private readonly config: ResolvedConfig;
  private readonly rateLimiter: RateLimiter;

  constructor(config: ResolvedConfig, rateLimiter: RateLimiter) {
    this.config = config;
    this.rateLimiter = rateLimiter;
  }

  /**
   * Make an authenticated request to the API
   */
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, params } = options;

    // Build the URL. The API key is sent via the Authorization header
    // (see executeRequest) so it never leaks into server/proxy logs.
    let url = `${this.config.baseUrl}/api/v1${path}`;
    const searchParams = new URLSearchParams();

    // Add any additional params
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      }
    }

    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    return this.executeRequest<T>(url, method, body);
  }

  /**
   * Make a request to a full URL (for pagination)
   */
  async requestUrl<T>(url: string): Promise<T> {
    // The API key is sent via the Authorization header in executeRequest.
    // Strip any legacy api_key query parameter so it never leaks into logs.
    const urlObj = new URL(url);
    urlObj.searchParams.delete('api_key');
    return this.executeRequest<T>(urlObj.toString(), 'GET', undefined);
  }

  /**
   * Execute the request with retry logic
   */
  private async executeRequest<T>(
    url: string,
    method: string,
    body: unknown,
    retryCount: number = 0
  ): Promise<T> {
    // Wait for a rate limit slot
    await this.rateLimiter.waitForSlot();

    // Build headers. The API key is sent via the Authorization header
    // rather than a URL query parameter so it is not exposed in
    // server access logs, proxy logs, or browser history.
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
    };

    // Record the request
    this.rateLimiter.recordRequest();

    // Make the request
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Handle the response
    return this.handleResponse<T>(response, url, method, body, retryCount);
  }

  /**
   * Handle the response and errors
   */
  private async handleResponse<T>(
    response: Response,
    url: string,
    method: string,
    body: unknown,
    retryCount: number
  ): Promise<T> {
    if (response.ok) {
      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return response.json() as Promise<T>;
      }
      // Return empty object for non-JSON responses
      return {} as T;
    }

    // Get response body for error details
    let responseBody: unknown;
    try {
      responseBody = await response.json();
    } catch {
      responseBody = await response.text();
    }

    switch (response.status) {
      case 401:
      case 403:
        throw new SyncroAuthenticationError(
          'Authentication failed - check your API key',
          response.status,
          responseBody
        );

      case 404:
        throw new SyncroNotFoundError('Resource not found', responseBody);

      case 422: {
        // Parse validation errors
        const errors = this.parseValidationErrors(responseBody);
        throw new SyncroValidationError(
          'Validation failed',
          errors,
          responseBody
        );
      }

      case 429:
        // Rate limited - retry with backoff
        if (this.rateLimiter.shouldRetry(retryCount)) {
          const delay = this.rateLimiter.calculateRetryDelay(retryCount);
          await this.sleep(delay);
          return this.executeRequest<T>(url, method, body, retryCount + 1);
        }
        throw new SyncroRateLimitError(
          'Rate limit exceeded and max retries reached',
          this.config.rateLimit.retryAfterMs,
          responseBody
        );

      default:
        if (response.status >= 500) {
          // Server error - retry with the same configurable
          // max-retries and backoff used for 429 responses.
          if (this.rateLimiter.shouldRetry(retryCount)) {
            const delay = this.rateLimiter.calculateRetryDelay(retryCount);
            await this.sleep(delay);
            return this.executeRequest<T>(url, method, body, retryCount + 1);
          }
          throw new SyncroServerError(
            `Server error: ${response.status} ${response.statusText}`,
            response.status,
            responseBody
          );
        }
        throw new SyncroError(
          `Request failed: ${response.status} ${response.statusText}`,
          response.status,
          responseBody
        );
    }
  }

  /**
   * Parse validation errors from response body
   */
  private parseValidationErrors(responseBody: unknown): Array<{ field: string; message: string }> {
    const errors: Array<{ field: string; message: string }> = [];

    if (typeof responseBody === 'object' && responseBody !== null) {
      const body = responseBody as Record<string, unknown>;

      // Syncro may return errors in various formats
      if (body['errors'] && typeof body['errors'] === 'object') {
        const errorsObj = body['errors'] as Record<string, unknown>;
        for (const [field, messages] of Object.entries(errorsObj)) {
          if (Array.isArray(messages)) {
            for (const message of messages) {
              errors.push({ field, message: String(message) });
            }
          } else if (typeof messages === 'string') {
            errors.push({ field, message: messages });
          }
        }
      } else if (body['error'] && typeof body['error'] === 'string') {
        errors.push({ field: 'base', message: body['error'] });
      }
    }

    return errors;
  }

  /**
   * Sleep for a given duration
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
