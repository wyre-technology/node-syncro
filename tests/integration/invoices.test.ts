/**
 * Invoices integration tests
 */

import { describe, it, expect } from 'vitest';
import { SyncroClient } from '../../src/client.js';

const client = new SyncroClient({
  apiKey: 'test-api-key',
  subdomain: 'test-company',
});

describe('Invoices Resource', () => {
  describe('list', () => {
    it('should list invoices', async () => {
      const response = await client.invoices.list();

      expect(response.invoices).toHaveLength(2);
      expect(response.invoices[0]?.number).toBe('INV-001');
    });
  });

  describe('get', () => {
    it('should get a single invoice', async () => {
      const invoice = await client.invoices.get(1);

      expect(invoice.id).toBe(1);
      expect(invoice.number).toBe('INV-001');
      expect(invoice.status).toBe('paid');
      expect(invoice.line_items).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('should create an invoice', async () => {
      const invoice = await client.invoices.create({
        customer_id: 1,
        date: '2024-06-15',
        due_date: '2024-07-15',
      });

      expect(invoice.id).toBe(100);
      expect(invoice.number).toBe('INV-100');
      expect(invoice.status).toBe('draft');
    });
  });

  describe('update', () => {
    it('should update an invoice', async () => {
      const invoice = await client.invoices.update(1, {
        notes: 'Monthly support - updated',
      });

      expect(invoice.notes).toBe('Monthly support - updated');
    });
  });

  describe('delete', () => {
    it('should delete an invoice', async () => {
      await expect(client.invoices.delete(1)).resolves.toBeUndefined();
    });
  });

  describe('email', () => {
    it('should email an invoice', async () => {
      await expect(client.invoices.email(1)).resolves.toBeUndefined();
    });

    it('should email an invoice with options', async () => {
      await expect(
        client.invoices.email(1, {
          cc_emails: 'accounting@example.com',
        })
      ).resolves.toBeUndefined();
    });
  });

  describe('print', () => {
    it('should get print URL', async () => {
      const result = await client.invoices.print(1);

      expect(result.pdf_url).toBe('https://example.com/invoice.pdf');
    });
  });

  describe('markSent', () => {
    it('should mark invoice as sent', async () => {
      const invoice = await client.invoices.markSent(1);

      expect(invoice.status).toBe('sent');
      expect(invoice.sent_at).toBeTruthy();
    });
  });
});
