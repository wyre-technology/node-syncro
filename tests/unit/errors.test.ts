/**
 * Error classes unit tests
 */

import { describe, it, expect } from 'vitest';
import {
  SyncroError,
  SyncroAuthenticationError,
  SyncroNotFoundError,
  SyncroValidationError,
  SyncroRateLimitError,
  SyncroServerError,
} from '../../src/errors.js';

describe('Error classes', () => {
  describe('SyncroError', () => {
    it('should create a base error', () => {
      const error = new SyncroError('Test error', 400, { detail: 'test' });

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.response).toEqual({ detail: 'test' });
      expect(error.name).toBe('SyncroError');
      expect(error instanceof Error).toBe(true);
      expect(error instanceof SyncroError).toBe(true);
    });

    it('should have default status code of 0', () => {
      const error = new SyncroError('Test error');
      expect(error.statusCode).toBe(0);
    });
  });

  describe('SyncroAuthenticationError', () => {
    it('should create an authentication error', () => {
      const error = new SyncroAuthenticationError('Invalid API key', 401);

      expect(error.message).toBe('Invalid API key');
      expect(error.statusCode).toBe(401);
      expect(error.name).toBe('SyncroAuthenticationError');
      expect(error instanceof SyncroError).toBe(true);
      expect(error instanceof SyncroAuthenticationError).toBe(true);
    });

    it('should default to 401 status', () => {
      const error = new SyncroAuthenticationError('Unauthorized');
      expect(error.statusCode).toBe(401);
    });
  });

  describe('SyncroNotFoundError', () => {
    it('should create a not found error', () => {
      const error = new SyncroNotFoundError('Customer not found');

      expect(error.message).toBe('Customer not found');
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe('SyncroNotFoundError');
      expect(error instanceof SyncroError).toBe(true);
      expect(error instanceof SyncroNotFoundError).toBe(true);
    });
  });

  describe('SyncroValidationError', () => {
    it('should create a validation error with field errors', () => {
      const errors = [
        { field: 'email', message: 'is invalid' },
        { field: 'name', message: 'is required' },
      ];
      const error = new SyncroValidationError('Validation failed', errors);

      expect(error.message).toBe('Validation failed');
      expect(error.statusCode).toBe(422);
      expect(error.errors).toEqual(errors);
      expect(error.name).toBe('SyncroValidationError');
      expect(error instanceof SyncroError).toBe(true);
      expect(error instanceof SyncroValidationError).toBe(true);
    });

    it('should default to empty errors array', () => {
      const error = new SyncroValidationError('Validation failed');
      expect(error.errors).toEqual([]);
    });
  });

  describe('SyncroRateLimitError', () => {
    it('should create a rate limit error', () => {
      const error = new SyncroRateLimitError('Rate limit exceeded', 10000);

      expect(error.message).toBe('Rate limit exceeded');
      expect(error.statusCode).toBe(429);
      expect(error.retryAfter).toBe(10000);
      expect(error.name).toBe('SyncroRateLimitError');
      expect(error instanceof SyncroError).toBe(true);
      expect(error instanceof SyncroRateLimitError).toBe(true);
    });

    it('should default to 5000ms retry', () => {
      const error = new SyncroRateLimitError('Rate limit exceeded');
      expect(error.retryAfter).toBe(5000);
    });
  });

  describe('SyncroServerError', () => {
    it('should create a server error', () => {
      const error = new SyncroServerError('Internal server error', 503);

      expect(error.message).toBe('Internal server error');
      expect(error.statusCode).toBe(503);
      expect(error.name).toBe('SyncroServerError');
      expect(error instanceof SyncroError).toBe(true);
      expect(error instanceof SyncroServerError).toBe(true);
    });

    it('should default to 500 status', () => {
      const error = new SyncroServerError('Server error');
      expect(error.statusCode).toBe(500);
    });
  });
});
