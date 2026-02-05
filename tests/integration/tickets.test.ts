/**
 * Tickets integration tests
 */

import { describe, it, expect } from 'vitest';
import { SyncroClient } from '../../src/client.js';

const client = new SyncroClient({
  apiKey: 'test-api-key',
  subdomain: 'test-company',
});

describe('Tickets Resource', () => {
  describe('list', () => {
    it('should list tickets', async () => {
      const response = await client.tickets.list();

      expect(response.tickets).toHaveLength(2);
      expect(response.tickets[0]?.subject).toBe('Network connectivity issue');
    });
  });

  describe('get', () => {
    it('should get a single ticket', async () => {
      const ticket = await client.tickets.get(1);

      expect(ticket.id).toBe(1);
      expect(ticket.number).toBe('TKT-001');
      expect(ticket.subject).toBe('Network connectivity issue');
      expect(ticket.comments).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('should create a ticket', async () => {
      const ticket = await client.tickets.create({
        customer_id: 1,
        subject: 'New ticket',
      });

      expect(ticket.id).toBe(100);
      expect(ticket.number).toBe('TKT-100');
      expect(ticket.status).toBe('New');
    });
  });

  describe('update', () => {
    it('should update a ticket', async () => {
      const ticket = await client.tickets.update(1, {
        status: 'In Progress',
      });

      expect(ticket.status).toBe('In Progress');
    });
  });

  describe('delete', () => {
    it('should delete a ticket', async () => {
      await expect(client.tickets.delete(1)).resolves.toBeUndefined();
    });
  });

  describe('addComment', () => {
    it('should add a comment to a ticket', async () => {
      const ticket = await client.tickets.addComment(1, {
        body: 'Checked router - needs firmware update',
      });

      expect(ticket.comments).toHaveLength(2);
      expect(ticket.comments[1]?.body).toBe('Checked router - needs firmware update');
    });
  });

  describe('timer operations', () => {
    it('should get timer', async () => {
      const timer = await client.tickets.getTimer(1);

      expect(timer.id).toBe(1);
      expect(timer.ticket_id).toBe(1);
      expect(timer.notes).toBe('Working on network issue');
    });

    it('should start timer', async () => {
      const timer = await client.tickets.startTimer(1, {
        notes: 'Working on network issue',
      });

      expect(timer.id).toBe(1);
    });

    it('should update timer', async () => {
      const timer = await client.tickets.updateTimer(1, {
        notes: 'Updated notes',
      });

      expect(timer.notes).toBe('Updated notes');
    });

    it('should delete timer', async () => {
      await expect(client.tickets.deleteTimer(1)).resolves.toBeUndefined();
    });
  });
});
