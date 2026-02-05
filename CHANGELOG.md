# 1.0.0 (2026-02-05)


### Bug Fixes

* Add ESLint configuration file ([820fa78](https://github.com/asachs01/node-syncro/commit/820fa78bd529e8a243b4b92e9853496f0a2d3da4))
* Add semantic-release plugins as devDependencies ([8224cf8](https://github.com/asachs01/node-syncro/commit/8224cf869ae5e07cdd153068e35fbb3018845e1a))


### Features

* Add semantic-release for GitHub Packages publishing ([2b828e8](https://github.com/asachs01/node-syncro/commit/2b828e850fd86a68a8f9ff688a56dc1f4eeec192))
* Initial release of node-syncro v0.1.0 ([5024b65](https://github.com/asachs01/node-syncro/commit/5024b65df786edb21fe3e3ff11a959ed013dec1b))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-02-04

### Added

- Initial release of node-syncro
- Full TypeScript support with complete type definitions
- SyncroClient with configuration options
  - API key authentication via query parameter
  - Subdomain or explicit base URL configuration
  - Configurable rate limiting
- Complete endpoint coverage:
  - Customers: list, get, create, update, delete
  - Contacts: list, get, create, update, delete
  - Tickets: list, get, create, update, delete, addComment, timer operations
  - Assets: list, get, create, update, delete
  - Invoices: list, get, create, update, delete, email, print, markSent
  - Estimates: list, get, create, update, delete, email, convertToInvoice
  - Line Items: list, get, create, update, delete
  - Contracts: list, get, create, update, delete
  - Appointments: list, get, create, update, delete
  - Products: list, get, create, update, delete
  - Payments: list, get, create, update, delete
  - Ticket Timers: list, get, create, update, delete
  - RMM Alerts: list, get, mute, resolve
  - Leads: list, get, create, update, delete, convert
  - Canned Responses: list, get
  - Ticket Problem Types: list, get
  - Wiki Pages: list, get, create, update, delete
  - Settings: get
  - Me: get current user
- Automatic pagination with async iterators and `listAll()` methods
- Built-in rate limiting (180 req/min)
  - Request tracking in rolling window
  - Preemptive throttling at configurable threshold
  - Automatic retry with exponential backoff on 429
- Custom error classes:
  - SyncroError (base)
  - SyncroAuthenticationError (401, 403)
  - SyncroNotFoundError (404)
  - SyncroValidationError (422)
  - SyncroRateLimitError (429)
  - SyncroServerError (500+)
- Comprehensive test suite with MSW mocks
- ESM and CommonJS builds
- Full documentation with examples

[Unreleased]: https://github.com/asachs01/node-syncro/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/asachs01/node-syncro/releases/tag/v0.1.0
