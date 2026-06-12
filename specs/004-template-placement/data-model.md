# Data Model: Template Management & Multi-Cluster Placement

## Entity Overview

```
Template 1──* TemplateVersion 1──* TemplateParameter
                                    TemplateResource

DeliveryTarget (standalone entity)

Environment *──1 TemplateVersion
Environment *──1 DeliveryTarget
```

## Entities

### Template

Represents a reusable environment definition in the catalog.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique identifier |
| `name` | string | yes | Display name |
| `description` | string | no | Human-readable description |
| `category` | string | no | Grouping category (e.g., "service", "infra") |
| `author` | string | no | Author name |
| `authorEmail` | string | no | Author contact email |
| `visibility` | enum | yes | `public` or `team` |
| `teamId` | string | conditional | Required when visibility is `team` |
| `createdAt` | string | yes | ISO 8601 timestamp |
| `updatedAt` | string | yes | ISO 8601 timestamp |

### TemplateVersion

A numbered release of a template with parameter and resource definitions.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique identifier |
| `templateId` | string | yes | Parent template reference |
| `version` | string | yes | Semantic version string (e.g., "v1.2.0") |
| `description` | string | no | Version release notes |
| `isLatest` | boolean | yes | Whether this is the latest version |
| `isStable` | boolean | yes | Whether this version is production-stable |
| `status` | enum | yes | `draft`, `stable`, `deprecated` |
| `parameters` | TemplateParameter[] | no | Configurable inputs for this version |
| `resources` | TemplateResource[] | no | Resource specifications for this version |
| `createdAt` | string | yes | ISO 8601 timestamp |
| `updatedAt` | string | yes | ISO 8601 timestamp |

### TemplateParameter

A configurable input defined on a template version.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Machine-readable key |
| `displayName` | string | yes | Human-readable label |
| `type` | enum | yes | `string`, `number`, `boolean` |
| `required` | boolean | yes | Whether a value must be provided |
| `defaultValue` | string | no | Default value if not overridden |
| `validation` | object | no | Optional validation rules (pattern, min/max) |

### TemplateResource

Resource requirements defined on a template version.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `kind` | string | yes | Resource kind (e.g., "Deployment", "ConfigMap") |
| `name` | string | yes | Resource name |
| `spec` | object | yes | Resource specification (key-value) |

### DeliveryTarget

A registered Kubernetes cluster available for environment placement.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique identifier |
| `name` | string | yes | Machine name for the target |
| `displayName` | string | yes | Human-readable display name |
| `purpose` | enum | yes | `dev`, `staging`, `production`, `dr` |
| `clusterName` | string | yes | Kubernetes cluster name |
| `clusterServer` | string | yes | Cluster API server URL |
| `availabilityState` | enum | yes | `available`, `unavailable`, `maintenance` |
| `healthState` | enum | yes | `healthy`, `degraded`, `unhealthy` |
| `capacitySummary` | object | no | Optional capacity info (cpuAvailable, memoryAvailable) |
| `createdAt` | string | yes | ISO 8601 timestamp |
| `updatedAt` | string | yes | ISO 8601 timestamp |

## Validation Rules

### Template
- `name` MUST be non-empty and unique within the catalog
- `visibility` MUST be `public` or `team`; when `team`, `teamId` is required

### TemplateVersion
- `version` MUST follow semantic versioning format (e.g., "v1.0.0")
- At most one version per template may have `isLatest: true`
- `status` transitions: `draft` → `stable` → `deprecated`

### TemplateParameter
- `name` MUST be unique within a version
- `type` MUST be one of `string`, `number`, `boolean`
- When `required: true`, a value MUST be provided at environment creation

### DeliveryTarget
- `name` MUST be non-empty and unique
- `availabilityState` MUST be one of `available`, `unavailable`, `maintenance`
- Only targets with `availabilityState: available` and `healthState: healthy` MAY be selected for new environment placement
- Targets with `availabilityState: unavailable` MUST be displayed as disabled in selection UI

## State Transitions

### TemplateVersion Status
```
draft ──→ stable ──→ deprecated
  │                     │
  └─── (delete) ───────┘
```

### DeliveryTarget Availability
```
available ←──→ unavailable
   ↓               ↓
maintenance ──→ available
```