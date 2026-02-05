/**
 * MSW request handlers for mocking the Syncro MSP API
 */

import { http, HttpResponse } from 'msw';
import * as fixtures from '../fixtures/index.js';

const BASE_URL = 'https://test-company.syncromsp.com';
const API_BASE = `${BASE_URL}/api/v1`;

export const handlers = [
  // Customers endpoints
  http.get(`${API_BASE}/customers`, ({ request }) => {
    const url = new URL(request.url);

    // Verify API key is present
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const page = url.searchParams.get('page') || '1';
    if (page === '2') {
      return HttpResponse.json(fixtures.customers.listPage2);
    }
    return HttpResponse.json(fixtures.customers.listPage1);
  }),

  http.get(`${API_BASE}/customers/:id`, ({ request, params }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (params['id'] === '999999') {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return HttpResponse.json(fixtures.customers.single);
  }),

  http.post(`${API_BASE}/customers`, async ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.customers.created, { status: 201 });
  }),

  http.put(`${API_BASE}/customers/:id`, async ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.customers.updated);
  }),

  http.delete(`${API_BASE}/customers/:id`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return new HttpResponse(null, { status: 204 });
  }),

  // Contacts endpoints
  http.get(`${API_BASE}/contacts`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.contacts.list);
  }),

  http.get(`${API_BASE}/contacts/:id`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.contacts.single);
  }),

  http.post(`${API_BASE}/contacts`, async ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.contacts.created, { status: 201 });
  }),

  http.put(`${API_BASE}/contacts/:id`, async ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.contacts.updated);
  }),

  http.delete(`${API_BASE}/contacts/:id`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return new HttpResponse(null, { status: 204 });
  }),

  // Tickets endpoints
  http.get(`${API_BASE}/tickets`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.tickets.list);
  }),

  http.get(`${API_BASE}/tickets/:id`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.tickets.single);
  }),

  http.post(`${API_BASE}/tickets`, async ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.tickets.created, { status: 201 });
  }),

  http.put(`${API_BASE}/tickets/:id`, async ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.tickets.updated);
  }),

  http.delete(`${API_BASE}/tickets/:id`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API_BASE}/tickets/:id/comment`, async ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.tickets.withComment);
  }),

  http.get(`${API_BASE}/tickets/:id/timer`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.tickets.timer);
  }),

  http.post(`${API_BASE}/tickets/:id/timer`, async ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.tickets.timer, { status: 201 });
  }),

  http.put(`${API_BASE}/tickets/:id/timer`, async ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.tickets.timerUpdated);
  }),

  http.delete(`${API_BASE}/tickets/:id/timer`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return new HttpResponse(null, { status: 204 });
  }),

  // Assets endpoints
  http.get(`${API_BASE}/customer_assets`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.assets.list);
  }),

  http.get(`${API_BASE}/customer_assets/:id`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.assets.single);
  }),

  http.post(`${API_BASE}/customer_assets`, async ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.assets.created, { status: 201 });
  }),

  http.put(`${API_BASE}/customer_assets/:id`, async ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.assets.updated);
  }),

  http.delete(`${API_BASE}/customer_assets/:id`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return new HttpResponse(null, { status: 204 });
  }),

  // Invoices endpoints
  http.get(`${API_BASE}/invoices`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.invoices.list);
  }),

  http.get(`${API_BASE}/invoices/:id`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.invoices.single);
  }),

  http.post(`${API_BASE}/invoices`, async ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.invoices.created, { status: 201 });
  }),

  http.put(`${API_BASE}/invoices/:id`, async ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.invoices.updated);
  }),

  http.delete(`${API_BASE}/invoices/:id`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API_BASE}/invoices/:id/email`, async ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json({ success: true });
  }),

  http.post(`${API_BASE}/invoices/:id/print`, async ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json({ pdf_url: 'https://example.com/invoice.pdf' });
  }),

  http.put(`${API_BASE}/invoices/:id/mark_sent`, async ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.invoices.markedSent);
  }),

  // Settings and Me endpoints
  http.get(`${API_BASE}/settings`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.settings.data);
  }),

  http.get(`${API_BASE}/me`, ({ request }) => {
    const url = new URL(request.url);
    if (!url.searchParams.get('api_key')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(fixtures.settings.me);
  }),

  // Rate limit test endpoint
  http.get(`${API_BASE}/rate-limited`, () => {
    return HttpResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }),

  // Validation error test endpoint
  http.post(`${API_BASE}/validation-error`, () => {
    return HttpResponse.json(
      {
        errors: {
          business_name: ['is required', 'must be at least 2 characters'],
          email: ['is invalid'],
        },
      },
      { status: 422 }
    );
  }),
];
