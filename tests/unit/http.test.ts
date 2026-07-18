/**
 * HttpClient response-handling tests.
 *
 * Regression: connectwise-automate-mcp#54 — API-backed calls returned an
 * empty object (200 with a non-JSON body was swallowed as `{}`), and error
 * paths threw "Body is unusable: Body has already been read" (the error path
 * consumed the body with response.json() and then re-read it with
 * response.text() in the catch). The body must be read exactly once.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpClient } from '../../src/http.js';
import { RateLimiter } from '../../src/rate-limiter.js';
import {
  SyncroError,
  SyncroNotFoundError,
  SyncroServerError,
} from '../../src/errors.js';
import type { ResolvedConfig } from '../../src/config.js';

const config: ResolvedConfig = {
  apiKey: 'test-api-key',
  baseUrl: 'https://test-company.syncromsp.com',
  rateLimit: {
    enabled: true,
    maxRequests: 180,
    windowMs: 60_000,
    throttleThreshold: 0.8,
    // Keep retry backoff tiny so the 5xx retry test stays fast.
    retryAfterMs: 10,
    maxRetries: 2,
  },
};

function makeClient(): HttpClient {
  return new HttpClient(config, new RateLimiter(config.rateLimit));
}

/** A real Response so body semantics (one-shot stream) are exercised. */
function realResponse(body: string, init: ResponseInit = {}): Response {
  return new Response(body, {
    status: 200,
    headers: { 'content-type': 'application/json' },
    ...init,
  });
}

describe('HttpClient response handling', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses a JSON 200 response', async () => {
    vi.mocked(fetch).mockResolvedValue(realResponse('[{"id":1}]'));
    const result = await makeClient().request('/customers');
    expect(result).toEqual([{ id: 1 }]);
  });

  it('parses JSON even when the content-type header is wrong', async () => {
    vi.mocked(fetch).mockResolvedValue(
      realResponse('{"id":7}', { headers: { 'content-type': 'text/plain' } })
    );
    const result = await makeClient().request('/customers/7');
    expect(result).toEqual({ id: 7 });
  });

  it('returns {} for a genuinely empty 200/204 body', async () => {
    vi.mocked(fetch).mockResolvedValue(
      realResponse('', { status: 200, headers: { 'content-type': 'text/plain' } })
    );
    const result = await makeClient().request('/tickets/1/timer_entry');
    expect(result).toEqual({});
  });

  it('throws a descriptive error (not {}) for a 200 with a non-JSON body', async () => {
    vi.mocked(fetch).mockResolvedValue(
      realResponse('<html>WAF challenge page</html>', {
        headers: { 'content-type': 'text/html' },
      })
    );
    await expect(makeClient().request('/customers')).rejects.toThrow(
      /Expected JSON .* text\/html.*WAF challenge page/
    );
  });

  it('reads a non-JSON error body exactly once — no "Body is unusable"', async () => {
    vi.mocked(fetch).mockResolvedValue(
      realResponse('<html>gateway error</html>', {
        status: 404,
        headers: { 'content-type': 'text/html' },
      })
    );
    // Before the fix this threw TypeError "Body is unusable: Body has already
    // been read" instead of the typed not-found error carrying the real body.
    const err = await makeClient()
      .request('/customers/999')
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(SyncroNotFoundError);
    expect((err as SyncroNotFoundError).response).toContain('gateway error');
  });

  it('passes a parsed JSON error body to the typed error', async () => {
    // 5xx retries until maxRetries is exhausted — every response must be a
    // fresh Response, since each attempt reads its one-shot body.
    vi.mocked(fetch).mockImplementation(() =>
      Promise.resolve(realResponse('{"message":"boom"}', { status: 503 }))
    );
    const err = await makeClient()
      .request('/customers')
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(SyncroServerError);
    expect((err as SyncroServerError).response).toEqual({ message: 'boom' });
  });

  it('generic non-2xx statuses raise SyncroError with the raw body', async () => {
    vi.mocked(fetch).mockResolvedValue(
      realResponse('teapot', { status: 418, headers: { 'content-type': 'text/plain' } })
    );
    const err = await makeClient()
      .request('/customers')
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(SyncroError);
    expect((err as SyncroError).response).toBe('teapot');
  });
});
