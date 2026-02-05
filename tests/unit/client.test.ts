/**
 * Client unit tests
 */

import { describe, it, expect } from 'vitest';
import { SyncroClient } from '../../src/client.js';

describe('SyncroClient', () => {
  describe('constructor', () => {
    it('should create a client with subdomain', () => {
      const client = new SyncroClient({
        apiKey: 'test-api-key',
        subdomain: 'test-company',
      });

      const config = client.getConfig();
      expect(config.baseUrl).toBe('https://test-company.syncromsp.com');
      expect(config.apiKey).toBe('test-api-key');
    });

    it('should create a client with explicit baseUrl', () => {
      const client = new SyncroClient({
        apiKey: 'test-api-key',
        baseUrl: 'https://custom.syncromsp.com',
      });

      const config = client.getConfig();
      expect(config.baseUrl).toBe('https://custom.syncromsp.com');
    });

    it('should remove trailing slash from baseUrl', () => {
      const client = new SyncroClient({
        apiKey: 'test-api-key',
        baseUrl: 'https://custom.syncromsp.com/',
      });

      const config = client.getConfig();
      expect(config.baseUrl).toBe('https://custom.syncromsp.com');
    });

    it('should throw if neither subdomain nor baseUrl provided', () => {
      expect(() => {
        new SyncroClient({
          apiKey: 'test-api-key',
        });
      }).toThrow('Either subdomain or baseUrl must be provided');
    });

    it('should throw if apiKey is missing', () => {
      expect(() => {
        new SyncroClient({
          apiKey: '',
          subdomain: 'test',
        });
      }).toThrow('apiKey is required');
    });

    it('should use default rate limit config', () => {
      const client = new SyncroClient({
        apiKey: 'test-api-key',
        subdomain: 'test-company',
      });

      const config = client.getConfig();
      expect(config.rateLimit.enabled).toBe(true);
      expect(config.rateLimit.maxRequests).toBe(180);
      expect(config.rateLimit.windowMs).toBe(60_000);
      expect(config.rateLimit.throttleThreshold).toBe(0.8);
    });

    it('should allow overriding rate limit config', () => {
      const client = new SyncroClient({
        apiKey: 'test-api-key',
        subdomain: 'test-company',
        rateLimit: {
          enabled: false,
          maxRequests: 100,
        },
      });

      const config = client.getConfig();
      expect(config.rateLimit.enabled).toBe(false);
      expect(config.rateLimit.maxRequests).toBe(100);
      expect(config.rateLimit.windowMs).toBe(60_000); // Default preserved
    });

    it('should initialize all resource handlers', () => {
      const client = new SyncroClient({
        apiKey: 'test-api-key',
        subdomain: 'test-company',
      });

      expect(client.customers).toBeDefined();
      expect(client.contacts).toBeDefined();
      expect(client.tickets).toBeDefined();
      expect(client.assets).toBeDefined();
      expect(client.invoices).toBeDefined();
      expect(client.estimates).toBeDefined();
      expect(client.lineItems).toBeDefined();
      expect(client.contracts).toBeDefined();
      expect(client.appointments).toBeDefined();
      expect(client.products).toBeDefined();
      expect(client.payments).toBeDefined();
      expect(client.ticketTimers).toBeDefined();
      expect(client.rmmAlerts).toBeDefined();
      expect(client.leads).toBeDefined();
      expect(client.cannedResponses).toBeDefined();
      expect(client.ticketProblemTypes).toBeDefined();
      expect(client.wikiPages).toBeDefined();
      expect(client.settings).toBeDefined();
    });
  });

  describe('rate limiting helpers', () => {
    it('should return remaining requests', () => {
      const client = new SyncroClient({
        apiKey: 'test-api-key',
        subdomain: 'test-company',
      });

      expect(client.getRemainingRequests()).toBe(180);
    });

    it('should return current rate', () => {
      const client = new SyncroClient({
        apiKey: 'test-api-key',
        subdomain: 'test-company',
      });

      expect(client.getCurrentRate()).toBe(0);
    });
  });
});
