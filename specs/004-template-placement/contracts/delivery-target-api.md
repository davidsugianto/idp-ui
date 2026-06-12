# Frontend Service Contracts: Delivery Targets

These contracts define the interface between the UI layer and the idp-core backend for delivery target operations. All calls go through `src/services/environments.ts` (to be extended) and are consumed via React Query hooks in `src/hooks/useEnvironments.ts`.

## Base URL

`{VITE_API_BASE_URL}/v1`

## Delivery Target Endpoints

### GET /delivery-targets — List Delivery Targets

**Purpose**: Fetch all registered delivery targets for browsing and environment placement selection.

**Query Parameters**: None required. Optional: `purpose`, `availability_state` filters.

**Response Shape** (200):
```json
[
  {
    "id": "tgt-1",
    "name": "dev-cluster-a",
    "display_name": "Development Cluster A",
    "purpose": "dev",
    "cluster_name": "cluster-dev-a",
    "cluster_server": "https://10.0.0.10",
    "availability_state": "available",
    "health_state": "healthy",
    "capacity_summary": {
      "cpu_available": "4",
      "memory_available": "8Gi"
    },
    "created_at": "2026-06-01T00:00:00Z",
    "updated_at": "2026-06-05T00:00:00Z"
  }
]
```

**Frontend Normalization**: Snake_case → camelCase for all fields.

**Error States**: 401, 403.

**UI States**:
- Loading: Skeleton table rows or Spin
- Empty: "No delivery targets registered" with admin guidance
- Error: Alert with retry action (refetch via React Query)

---

### GET /delivery-targets/:id — Get Delivery Target Detail

**Purpose**: Fetch full details for a specific delivery target.

**Response Shape** (200): Single delivery target object (same shape as list item).

**Error States**: 401, 403, 404.

---

### POST /delivery-targets — Create Delivery Target (Admin)

**Purpose**: Register a new delivery target for environment placement.

**Request Shape**:
```json
{
  "name": "dev-cluster-a",
  "display_name": "Development Cluster A",
  "purpose": "dev",
  "cluster_name": "cluster-dev-a",
  "cluster_server": "https://10.0.0.10",
  "availability_state": "available",
  "health_state": "healthy"
}
```

**Response Shape** (201): `{ "id": "tgt-new" }`

**Error States**: 400 (validation), 401, 403, 409 (name conflict).

---

### PATCH /delivery-targets/:id — Update Delivery Target (Admin)

**Purpose**: Update delivery target properties, including availability state.

**Request Shape** (partial):
```json
{
  "availability_state": "unavailable",
  "health_state": "degraded"
}
```

**Response Shape** (200): Updated delivery target object.

---

### DELETE /delivery-targets/:id — Delete Delivery Target (Admin)

**Purpose**: Remove a delivery target. Fails with 409 if environments are placed on it.

**Error States**: 401, 403, 404, 409 (environments placed on target).

---

## React Query Integration Notes

- `useDeliveryTargets()` hook provides the query for `GET /delivery-targets` with query key `['delivery-targets']`
- `useDeliveryTarget(id)` hook provides the query for `GET /delivery-targets/:id`
- Target options for the environment creation wizard Select are derived from the same query cache
- Targets with `availability_state !== 'available'` are rendered as disabled options with `(unavailable)` suffix
- Mutations (create, update, delete) invalidate the `['delivery-targets']` query key on success