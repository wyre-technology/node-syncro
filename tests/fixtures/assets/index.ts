/**
 * Asset fixtures
 */

export const list = {
  assets: [
    {
      id: 1,
      customer_id: 1,
      contact_id: null,
      name: 'Main Server',
      asset_type: 'Server',
      asset_serial: 'SRV-001234',
      manufacturer: 'Dell',
      model: 'PowerEdge R740',
      purchase_date: '2023-01-15',
      warranty_expires: '2026-01-15',
      notes: 'Production server',
      syncro_uuid: 'abc123-def456',
      rmm_computer_id: 12345,
      kabesco_enabled: true,
      created_at: '2023-01-20T10:00:00Z',
      updated_at: '2024-03-15T14:00:00Z',
      properties: {
        location: 'Server Room A',
      },
    },
    {
      id: 2,
      customer_id: 1,
      contact_id: 1,
      name: 'Workstation 1',
      asset_type: 'Desktop',
      asset_serial: 'WKS-005678',
      manufacturer: 'HP',
      model: 'ProDesk 400',
      purchase_date: '2023-06-01',
      warranty_expires: '2026-06-01',
      notes: '',
      syncro_uuid: null,
      rmm_computer_id: null,
      kabesco_enabled: false,
      created_at: '2023-06-05T09:00:00Z',
      updated_at: '2023-06-05T09:00:00Z',
      properties: {},
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
  asset: {
    id: 1,
    customer_id: 1,
    contact_id: null,
    name: 'Main Server',
    asset_type: 'Server',
    asset_serial: 'SRV-001234',
    manufacturer: 'Dell',
    model: 'PowerEdge R740',
    purchase_date: '2023-01-15',
    warranty_expires: '2026-01-15',
    notes: 'Production server',
    syncro_uuid: 'abc123-def456',
    rmm_computer_id: 12345,
    kabesco_enabled: true,
    created_at: '2023-01-20T10:00:00Z',
    updated_at: '2024-03-15T14:00:00Z',
    properties: {
      location: 'Server Room A',
    },
  },
};

export const created = {
  asset: {
    id: 100,
    customer_id: 1,
    contact_id: null,
    name: 'New Asset',
    asset_type: 'Other',
    asset_serial: '',
    manufacturer: '',
    model: '',
    purchase_date: null,
    warranty_expires: null,
    notes: '',
    syncro_uuid: null,
    rmm_computer_id: null,
    kabesco_enabled: false,
    created_at: '2024-06-15T10:00:00Z',
    updated_at: '2024-06-15T10:00:00Z',
    properties: {},
  },
};

export const updated = {
  asset: {
    id: 1,
    customer_id: 1,
    contact_id: null,
    name: 'Main Server - Updated',
    asset_type: 'Server',
    asset_serial: 'SRV-001234',
    manufacturer: 'Dell',
    model: 'PowerEdge R740',
    purchase_date: '2023-01-15',
    warranty_expires: '2026-01-15',
    notes: 'Production server - updated notes',
    syncro_uuid: 'abc123-def456',
    rmm_computer_id: 12345,
    kabesco_enabled: true,
    created_at: '2023-01-20T10:00:00Z',
    updated_at: '2024-06-15T15:00:00Z',
    properties: {
      location: 'Server Room A',
    },
  },
};
