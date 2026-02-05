/**
 * Customers integration tests
 */

import { describe, it, expect } from 'vitest';
import { SyncroClient } from '../../src/client.js';
import { SyncroNotFoundError } from '../../src/errors.js';

const client = new SyncroClient({
  apiKey: 'test-api-key',
  subdomain: 'test-company',
});

describe('Customers Resource', () => {
  describe('list', () => {
    it('should list customers', async () => {
      const response = await client.customers.list();

      expect(response.customers).toHaveLength(2);
      expect(response.meta.total_entries).toBe(3);
      expect(response.meta.page).toBe(1);
    });

    it('should support pagination', async () => {
      const response = await client.customers.list({ page: 2 });

      expect(response.customers).toHaveLength(1);
      expect(response.meta.page).toBe(2);
    });
  });

  describe('listAll', () => {
    it('should auto-paginate through all customers', async () => {
      const customers = await client.customers.listAll().toArray();

      expect(customers).toHaveLength(3);
      expect(customers[0]?.business_name).toBe('Acme Corp');
      expect(customers[2]?.business_name).toBe('Gamma LLC');
    });

    it('should support async iteration', async () => {
      const names: string[] = [];

      for await (const customer of client.customers.listAll()) {
        names.push(customer.business_name);
      }

      expect(names).toEqual(['Acme Corp', 'Beta Inc', 'Gamma LLC']);
    });
  });

  describe('get', () => {
    it('should get a single customer', async () => {
      const customer = await client.customers.get(1);

      expect(customer.id).toBe(1);
      expect(customer.business_name).toBe('Acme Corp');
      expect(customer.email).toBe('john@acme.com');
    });

    it('should throw NotFoundError for missing customer', async () => {
      await expect(client.customers.get(999999)).rejects.toThrow(SyncroNotFoundError);
    });
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const customer = await client.customers.create({
        business_name: 'New Customer Inc',
        email: 'new@customer.com',
      });

      expect(customer.id).toBe(100);
      expect(customer.business_name).toBe('New Customer Inc');
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const customer = await client.customers.update(1, {
        business_name: 'Acme Corp Updated',
        notes: 'Updated notes',
      });

      expect(customer.business_name).toBe('Acme Corp Updated');
      expect(customer.notes).toBe('Updated notes');
    });
  });

  describe('delete', () => {
    it('should delete a customer', async () => {
      await expect(client.customers.delete(1)).resolves.toBeUndefined();
    });
  });
});
