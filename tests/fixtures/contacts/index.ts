/**
 * Contact fixtures
 */

export const list = {
  contacts: [
    {
      id: 1,
      customer_id: 1,
      name: 'John Doe',
      address1: '123 Main St',
      address2: 'Suite 100',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      email: 'john@acme.com',
      phone: '555-1234',
      mobile: '555-5678',
      notes: 'Primary contact',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 2,
      customer_id: 1,
      name: 'Jane Smith',
      address1: '123 Main St',
      address2: '',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      email: 'jane@acme.com',
      phone: '555-2222',
      mobile: '',
      notes: '',
      created_at: '2024-02-20T09:00:00Z',
      updated_at: '2024-02-20T09:00:00Z',
    },
  ],
  meta: {
    total_pages: 1,
    total_entries: 2,
    per_page: 25,
    page: 1,
  },
};

export const single = {
  contact: {
    id: 1,
    customer_id: 1,
    name: 'John Doe',
    address1: '123 Main St',
    address2: 'Suite 100',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    email: 'john@acme.com',
    phone: '555-1234',
    mobile: '555-5678',
    notes: 'Primary contact',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
};

export const created = {
  contact: {
    id: 100,
    customer_id: 1,
    name: 'New Contact',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    email: 'new@acme.com',
    phone: '',
    mobile: '',
    notes: '',
    created_at: '2024-06-15T10:00:00Z',
    updated_at: '2024-06-15T10:00:00Z',
  },
};

export const updated = {
  contact: {
    id: 1,
    customer_id: 1,
    name: 'John Doe Updated',
    address1: '123 Main St',
    address2: 'Suite 100',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    email: 'john.updated@acme.com',
    phone: '555-1234',
    mobile: '555-5678',
    notes: 'Primary contact - updated',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-06-15T15:00:00Z',
  },
};
