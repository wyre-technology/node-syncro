/**
 * Rate limiter unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RateLimiter } from '../../src/rate-limiter.js';
import { DEFAULT_RATE_LIMIT_CONFIG } from '../../src/config.js';

describe('RateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('constructor', () => {
    it('should initialize with config', () => {
      const limiter = new RateLimiter(DEFAULT_RATE_LIMIT_CONFIG);
      expect(limiter.getRemainingRequests()).toBe(180);
      expect(limiter.getCurrentRate()).toBe(0);
    });
  });

  describe('recordRequest', () => {
    it('should track requests', () => {
      const limiter = new RateLimiter(DEFAULT_RATE_LIMIT_CONFIG);

      limiter.recordRequest();
      expect(limiter.getRemainingRequests()).toBe(179);
      expect(limiter.getCurrentRate()).toBeCloseTo(1 / 180);

      limiter.recordRequest();
      expect(limiter.getRemainingRequests()).toBe(178);
    });

    it('should not track when disabled', () => {
      const limiter = new RateLimiter({ ...DEFAULT_RATE_LIMIT_CONFIG, enabled: false });

      limiter.recordRequest();
      expect(limiter.getRemainingRequests()).toBe(180);
    });
  });

  describe('pruneOldTimestamps', () => {
    it('should remove old timestamps outside window', () => {
      const limiter = new RateLimiter(DEFAULT_RATE_LIMIT_CONFIG);

      limiter.recordRequest();
      limiter.recordRequest();
      expect(limiter.getRemainingRequests()).toBe(178);

      // Advance time past the window
      vi.advanceTimersByTime(61_000);

      expect(limiter.getRemainingRequests()).toBe(180);
    });
  });

  describe('waitForSlot', () => {
    it('should resolve immediately when under threshold', async () => {
      const limiter = new RateLimiter(DEFAULT_RATE_LIMIT_CONFIG);

      const start = Date.now();
      await limiter.waitForSlot();
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(10);
    });

    it('should resolve immediately when disabled', async () => {
      const limiter = new RateLimiter({ ...DEFAULT_RATE_LIMIT_CONFIG, enabled: false });

      // Record lots of requests
      for (let i = 0; i < 200; i++) {
        limiter.recordRequest();
      }

      const start = Date.now();
      await limiter.waitForSlot();
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(10);
    });
  });

  describe('shouldRetry', () => {
    it('should return true when under max retries', () => {
      const limiter = new RateLimiter(DEFAULT_RATE_LIMIT_CONFIG);

      expect(limiter.shouldRetry(0)).toBe(true);
      expect(limiter.shouldRetry(1)).toBe(true);
      expect(limiter.shouldRetry(2)).toBe(true);
    });

    it('should return false when at or over max retries', () => {
      const limiter = new RateLimiter(DEFAULT_RATE_LIMIT_CONFIG);

      expect(limiter.shouldRetry(3)).toBe(false);
      expect(limiter.shouldRetry(4)).toBe(false);
    });
  });

  describe('calculateRetryDelay', () => {
    it('should calculate exponential backoff', () => {
      const limiter = new RateLimiter(DEFAULT_RATE_LIMIT_CONFIG);

      expect(limiter.calculateRetryDelay(0)).toBe(5000);
      expect(limiter.calculateRetryDelay(1)).toBe(10000);
      expect(limiter.calculateRetryDelay(2)).toBe(20000);
    });

    it('should cap at 30 seconds', () => {
      const limiter = new RateLimiter(DEFAULT_RATE_LIMIT_CONFIG);

      expect(limiter.calculateRetryDelay(10)).toBe(30000);
    });
  });
});
