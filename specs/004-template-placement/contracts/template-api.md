# Frontend Service Contracts: Templates

These contracts define the interface between the UI layer and the idp-core backend for template operations. All calls go through `src/services/environments.ts` (to be extended) and are consumed via React Query hooks in `src/hooks/useEnvironments.ts`.

## Base URL

`{VITE_API_BASE_URL}/v1`

## Template Endpoints

### GET /templates — List Templates

**Purpose**: Fetch the browsable template catalog.

**Query Parameters**: None required. Optional: `category`, `visibility`, `team_id` filters.

**Response Shape** (200):
```json
[
  {
    "id": "tpl-1",
    "name": "Standard Microservice",
    "description": "A standard microservice template",
    "category": "service",
    "author": "Platform Team",
    "author_email": "platform@example.com",
    "visibility": "public",
    "team_id": null,
    "latest_version": "v1.2.0",
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-06-01T00:00:00Z"
  }
]
```

**Frontend Normalization**: Snake_case → camelCase. Fields with underscores (`author_email`, `team_id`, `latest_version`, `created_at`, `updated_at`) are mapped in the service layer.

**Error States**: 401 (unauthorized), 403 (forbidden).

**UI States**:
- Loading: Skeleton table rows or Spin
- Empty: "No templates available" with admin guidance
- Error: Alert with retry action (refetch via React Query)

---

### GET /templates/:id — Get Template Detail

**Purpose**: Fetch full template details including version history.

**Response Shape** (200):
```json
{
  "id": "tpl-1",
  "name": "Standard Microservice",
  "description": "A standard microservice template",
  "category": "service",
  "author": "Platform Team",
  "author_email": "platform@example.com",
  "visibility": "public",
  "team_id": null,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-06-01T00:00:00Z"
}
```

**Error States**: 401, 403, 404.

---

### GET /templates/:id/versions — List Template Versions

**Purpose**: Fetch version history for a specific template.

**Response Shape** (200):
```json
[
  {
    "id": "ver-1",
    "template_id": "tpl-1",
    "version": "v1.2.0",
    "description": "Added resource limits",
    "is_latest": true,
    "is_stable": true,
    "status": "stable",
    "parameters": [
      {
        "name": "replicas",
        "display_name": "Replicas",
        "type": "number",
        "required": true,
        "default_value": "2",
        "validation": { "min": 1, "max": 10 }
      }
    ],
    "resources": [
      {
        "kind": "Deployment",
        "name": "app",
        "spec": { "cpu": "500m", "memory": "256Mi" }
      }
    ],
    "created_at": "2026-06-01T00:00:00Z",
    "updated_at": "2026-06-01T00:00:00Z"
  }
]
```

**Frontend Query Key**: `['template-versions', templateId]` — invalidated when versions change.

---

### POST /templates — Create Template (Admin)

**Purpose**: Create a new template definition.

**Request Shape**:
```json
{
  "name": "My Template",
  "description": "Template description",
  "category": "service",
  "author": "Admin Name",
  "author_email": "admin@example.com",
  "visibility": "public",
  "team_id": null
}
```

**Response Shape** (201): `{ "id": "tpl-new" }`

**Error States**: 400 (validation), 401, 403, 409 (name conflict).

---

### POST /templates/:id/versions — Create Template Version (Admin)

**Purpose**: Publish a new version for a template.

**Request Shape**:
```json
{
  "version": "v1.0.0",
  "description": "Initial release",
  "is_latest": true,
  "is_stable": true,
  "status": "stable"
}
```

**Response Shape** (201): Template version object (same as GET response).

---

### PUT /templates/:id/versions/:versionId/parameters — Replace Parameters (Admin)

**Purpose**: Set or replace parameter definitions for a version.

**Request Shape**:
```json
[
  {
    "name": "replicas",
    "display_name": "Replicas",
    "type": "number",
    "required": true,
    "default_value": "2",
    "validation": { "min": 1, "max": 10 }
  }
]
```

---

### PUT /templates/:id/versions/:versionId/resources — Replace Resources (Admin)

**Purpose**: Set or replace resource definitions for a version.

**Request Shape**:
```json
[
  {
    "kind": "Deployment",
    "name": "app",
    "spec": { "cpu": "500m", "memory": "256Mi" }
  }
]
```

---

### POST /templates/:id/versions/:versionId/validate — Validate Inputs

**Purpose**: Validate template inputs against parameter definitions before environment creation.

**Request Shape**:
```json
{
  "inputs": { "service_name": "payments-api" }
}
```

**Response Shape**: Validation result with errors if invalid.

---

### DELETE /templates/:id — Delete Template (Admin)

**Purpose**: Remove a template. Fails with 409 if environments reference it.

**Error States**: 401, 403, 404, 409 (referenced by environments).