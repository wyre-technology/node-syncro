# node-syncro

Comprehensive, fully-typed Node.js/TypeScript library for the [Syncro MSP](https://syncromsp.com) API.

## Features

- Complete API coverage for all Syncro MSP endpoints
- Full TypeScript support with strong typing
- Automatic pagination with async iterators
- Built-in rate limiting (180 req/min)
- Automatic retry with exponential backoff
- Zero dependencies (uses native fetch)
- Comprehensive test suite with mocked responses

## Installation

```bash
npm install node-syncro
```

## Quick Start

```typescript
import { SyncroClient } from 'node-syncro';

const client = new SyncroClient({
  apiKey: process.env.SYNCRO_API_KEY!,
  subdomain: 'your-company', // Results in: https://your-company.syncromsp.com
});

// List customers
const { customers } = await client.customers.list({
  query: 'Acme',
  perPage: 50,
});

// Get a single customer
const customer = await client.customers.get(12345);

// Auto-paginate through all tickets
for await (const ticket of client.tickets.listAll({
  status: 'open',
})) {
  console.log(ticket.number, ticket.subject);
}
```

## Configuration

```typescript
const client = new SyncroClient({
  // Required: Your Syncro API key
  apiKey: 'your-api-key',

  // Option 1: Subdomain (recommended)
  subdomain: 'your-company',

  // Option 2: Explicit base URL
  // baseUrl: 'https://your-company.syncromsp.com',

  // Optional: Rate limiting configuration
  rateLimit: {
    enabled: true,           // default: true
    maxRequests: 180,        // default: 180 (Syncro limit)
    windowMs: 60_000,        // default: 60000 (1 minute)
    throttleThreshold: 0.8,  // default: 0.8 (80%)
    retryAfterMs: 5_000,     // default: 5000
    maxRetries: 3,           // default: 3
  },
});
```

## API Reference

### Customers

```typescript
// List customers
const { customers, meta } = await client.customers.list({
  query: 'search term',
  include_disabled: true,
  page: 1,
  perPage: 50,
});

// Get all customers with auto-pagination
const allCustomers = await client.customers.listAll().toArray();

// Get a single customer
const customer = await client.customers.get(id);

// Create a customer
const customer = await client.customers.create({
  business_name: 'Acme Corp',
  email: 'contact@acme.com',
});

// Update a customer
const customer = await client.customers.update(id, {
  notes: 'Updated notes',
});

// Delete a customer
await client.customers.delete(id);
```

### Contacts

```typescript
const { contacts } = await client.contacts.list({ customer_id: 123 });
const contact = await client.contacts.get(id);
const contact = await client.contacts.create({ customer_id: 123, name: 'John Doe' });
const contact = await client.contacts.update(id, { email: 'new@email.com' });
await client.contacts.delete(id);
```

### Tickets

```typescript
// List tickets
const { tickets } = await client.tickets.list({
  customer_id: 123,
  status: 'Open',
  user_id: 456,
});

// Get a ticket
const ticket = await client.tickets.get(id);

// Create a ticket
const ticket = await client.tickets.create({
  customer_id: 123,
  subject: 'Network issue',
  problem_type: 'Network',
});

// Update a ticket
const ticket = await client.tickets.update(id, {
  status: 'In Progress',
});

// Add a comment
const ticket = await client.tickets.addComment(id, {
  body: 'Working on this issue...',
  hidden: false,
});

// Timer operations
const timer = await client.tickets.startTimer(id, { notes: 'On-site visit' });
const timer = await client.tickets.getTimer(id);
const timer = await client.tickets.updateTimer(id, { notes: 'Updated' });
await client.tickets.deleteTimer(id);
```

### Assets

```typescript
const { assets } = await client.assets.list({ customer_id: 123 });
const asset = await client.assets.get(id);
const asset = await client.assets.create({ customer_id: 123, name: 'Server 1' });
const asset = await client.assets.update(id, { notes: 'Updated' });
await client.assets.delete(id);
```

### Invoices

```typescript
// List invoices
const { invoices } = await client.invoices.list({
  customer_id: 123,
  status: 'sent',
});

// Get an invoice
const invoice = await client.invoices.get(id);

// Create an invoice
const invoice = await client.invoices.create({
  customer_id: 123,
  date: '2024-06-15',
  due_date: '2024-07-15',
});

// Update an invoice
const invoice = await client.invoices.update(id, { notes: 'Updated' });

// Delete an invoice
await client.invoices.delete(id);

// Email an invoice
await client.invoices.email(id, { cc_emails: 'accounting@example.com' });

// Print an invoice (get PDF URL)
const { pdf_url } = await client.invoices.print(id);

// Mark as sent
const invoice = await client.invoices.markSent(id);
```

### Estimates

```typescript
const { estimates } = await client.estimates.list();
const estimate = await client.estimates.get(id);
const estimate = await client.estimates.create({ customer_id: 123 });
const estimate = await client.estimates.update(id, { notes: 'Updated' });
await client.estimates.delete(id);
await client.estimates.email(id);
const invoice = await client.estimates.convertToInvoice(id);
```

### Line Items

```typescript
const { line_items } = await client.lineItems.list({ invoice_id: 123 });
const lineItem = await client.lineItems.get(id);
const lineItem = await client.lineItems.create({
  name: 'IT Support',
  price: 150,
  quantity: 2,
  invoice_id: 123,
});
const lineItem = await client.lineItems.update(id, { price: 175 });
await client.lineItems.delete(id);
```

### Other Resources

The library also provides full CRUD support for:

- `client.contracts` - Contracts
- `client.appointments` - Appointments
- `client.products` - Products
- `client.payments` - Payments
- `client.ticketTimers` - Ticket time entries
- `client.rmmAlerts` - RMM alerts (list, get, mute, resolve)
- `client.leads` - Leads (with convert to customer)
- `client.cannedResponses` - Canned responses (read-only)
- `client.ticketProblemTypes` - Ticket problem types (read-only)
- `client.wikiPages` - Wiki pages

### Settings & Current User

```typescript
// Get company settings
const settings = await client.settings.get();

// Get current authenticated user
const me = await client.me();
```

## Pagination

All list methods return paginated results with metadata:

```typescript
const { customers, meta } = await client.customers.list({
  page: 1,
  perPage: 50,
});

console.log(meta.total_entries);  // Total number of customers
console.log(meta.total_pages);    // Total number of pages
console.log(meta.page);           // Current page
console.log(meta.per_page);       // Results per page
```

For automatic pagination, use the `listAll()` methods:

```typescript
// Async iteration
for await (const customer of client.customers.listAll()) {
  console.log(customer.business_name);
}

// Collect all into array
const allCustomers = await client.customers.listAll().toArray();
```

## Error Handling

The library throws typed errors for different scenarios:

```typescript
import {
  SyncroError,
  SyncroAuthenticationError,
  SyncroNotFoundError,
  SyncroValidationError,
  SyncroRateLimitError,
  SyncroServerError,
} from 'node-syncro';

try {
  await client.customers.get(999999);
} catch (error) {
  if (error instanceof SyncroNotFoundError) {
    console.log('Customer not found');
  } else if (error instanceof SyncroAuthenticationError) {
    console.log('Invalid API key');
  } else if (error instanceof SyncroValidationError) {
    console.log('Validation errors:', error.errors);
  } else if (error instanceof SyncroRateLimitError) {
    console.log('Rate limited, retry after:', error.retryAfter);
  } else if (error instanceof SyncroServerError) {
    console.log('Server error:', error.statusCode);
  }
}
```

## Rate Limiting

The library automatically handles Syncro's rate limit of 180 requests per minute:

- Tracks requests in a rolling 60-second window
- Adds delays when approaching the limit (configurable threshold)
- Automatically retries with exponential backoff on 429 errors
- Provides methods to check current rate

```typescript
// Check remaining requests
console.log(client.getRemainingRequests()); // 180

// Check current rate (0-1)
console.log(client.getCurrentRate()); // 0.0
```

## Requirements

- Node.js >= 18.0.0
- TypeScript >= 5.0 (for type definitions)

## License

Apache-2.0

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
