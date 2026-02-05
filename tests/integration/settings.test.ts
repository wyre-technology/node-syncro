/**
 * Settings and Me integration tests
 */

import { describe, it, expect } from 'vitest';
import { SyncroClient } from '../../src/client.js';

const client = new SyncroClient({
  apiKey: 'test-api-key',
  subdomain: 'test-company',
});

describe('Settings Resource', () => {
  describe('get', () => {
    it('should get company settings', async () => {
      const settings = await client.settings.get();

      expect(settings.business_name).toBe('Test MSP Company');
      expect(settings.email).toBe('support@testmsp.com');
      expect(settings.timezone).toBe('America/Los_Angeles');
    });
  });
});

describe('Me', () => {
  describe('me()', () => {
    it('should get current user', async () => {
      const me = await client.me();

      expect(me.id).toBe(1);
      expect(me.email).toBe('admin@testmsp.com');
      expect(me.name).toBe('Admin User');
      expect(me.role).toBe('admin');
    });
  });
});
