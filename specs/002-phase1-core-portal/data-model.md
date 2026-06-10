# Data Model: IDP UI Phase 1 Core Portal

## Portal User
- **Purpose**: Represents an authenticated person using the portal.
- **Fields**:
  - `id`: stable user identifier.
  - `name`: display name shown in the portal shell.
  - `email`: user identity shown in profile and admin contexts.
  - `roles`: authorization roles used for admin gating and access decisions.
  - `groups`: team or group memberships used for ownership context.
  - `isAuthenticated`: derived access state for protected routes.
- **Relationships**:
  - May own or manage many environments.
  - May hold elevated permissions that unlock administrative records and actions.
  - May own many API key records.
- **Validation rules**:
  - Authenticated users require a stable identifier and email.
  - Roles and groups default to empty lists when omitted.
- **State transitions**:
  - `signed_out` → `signing_in` → `authenticated`.
  - `authenticated` → `expired` when refresh or access validation fails.
  - `authenticated` or `expired` → `signed_out` on logout.

## Auth Session
- **Purpose**: Captures the active session state that governs protected access.
- **Fields**:
  - `authToken`: current token used for authenticated requests.
  - `expiresIn`: session lifetime metadata.
  - `hasHydratedAuth`: whether persisted session state has been resolved.
  - `isAuthenticated`: whether the current session is usable.
- **Relationships**:
  - Belongs to one portal user while authenticated.
- **Validation rules**:
  - A hydrated authenticated session must have enough token data to support protected requests.
  - A non-hydrated state must resolve before a protected route decides whether to render or redirect.
- **State transitions**:
  - `unhydrated` → `authenticated` or `signed_out`.
  - `authenticated` → `refreshing` during token renewal.
  - `refreshing` → `authenticated` on success or `signed_out` on failure.

## Environment
- **Purpose**: Represents a managed deployment environment surfaced in dashboard, browser, detail, and creation flows.
- **Fields**:
  - `id`: unique environment identifier.
  - `teamId`: owning team reference.
  - `name`: environment display name.
  - `description`: optional business or technical summary.
  - `namespace`: runtime namespace.
  - `status`: lifecycle or health state.
  - `gitRepoUrl`: linked source repository.
  - `gitRevision`: branch, tag, or revision reference.
  - `manifestPath`: deployment manifest location.
  - `clusterName`: target cluster label.
  - `clusterServer`: optional cluster endpoint reference.
  - `resourceQuotaCpu`, `resourceQuotaMemory`: optional quota settings.
  - `labels`: optional metadata tags.
  - `ownerId`: optional owner user reference.
  - `expiresAt`: optional scheduled expiration.
  - `lastSyncAt`: most recent synchronization timestamp.
  - `lastError`: latest environment-level error detail.
  - `errorCount`: number of recent errors.
  - `createdAt`, `updatedAt`: lifecycle timestamps.
- **Relationships**:
  - Contains many workloads.
  - Appears in dashboard summaries and recent-environment lists.
  - Can be created, synchronized, and potentially deleted by authorized users.
- **Validation rules**:
  - Required identity and lifecycle fields must always be present in list and detail views.
  - Creation requires enough source and deployment metadata to produce a valid backend request.
  - Status values must map to supported UI states.
- **State transitions**:
  - `creating` → `active` or `error`.
  - `active` → `syncing` during a synchronization action.
  - `active` or `error` → `deleting` during removal if supported.

## Environment Filter Query
- **Purpose**: Represents developer-selected narrowing of environment results.
- **Fields**:
  - `search`: text query for environment names.
  - `status`: selected lifecycle filter or `all`.
  - `team`: optional team filter.
  - `cluster`: optional cluster filter.
  - `sort`: selected sort field and direction.
  - `page`: current pagination cursor or page number.
- **Relationships**:
  - Applies to the environment list view.
- **Validation rules**:
  - Empty search and unset filters mean the full visible dataset.
  - Filter state must be resettable without reloading the application shell.

## Workload
- **Purpose**: Represents an individual workload displayed on environment detail views.
- **Fields**:
  - `name`: workload name.
  - `kind`: workload type.
  - `status`: runtime health or readiness state.
  - `desiredReplicas`: desired replica count.
  - `readyReplicas`: ready replica count.
  - `image`: deployed artifact reference.
- **Relationships**:
  - Belongs to one environment.
- **Validation rules**:
  - Replica counts must be non-negative integers.
  - Name, kind, and status must always be present for rendered workload rows.

## Workload Status Summary
- **Purpose**: Aggregates workload and pod health for one environment.
- **Fields**:
  - `environmentId`: referenced environment.
  - `namespace`: workload namespace.
  - `totalWorkloads`, `healthyWorkloads`, `degradedWorkloads`: workload counts.
  - `totalPods`, `runningPods`, `pendingPods`, `failedPods`: pod counts.
  - `workloads`: collection of workload records.
- **Relationships**:
  - Belongs to one environment.
- **Validation rules**:
  - Summary counts must remain internally consistent.
  - Missing workload data must degrade to a recoverable view state rather than break the surrounding detail page.

## Dashboard Summary
- **Purpose**: Aggregates the information shown on the landing page.
- **Fields**:
  - `environmentCount`: total visible environments.
  - `activeCount`: currently active or ready environments.
  - `alertCount`: environments or workloads needing attention.
  - `recentEnvironments`: recent items for quick navigation.
  - `costSummary`: optional spend rollup.
  - `recommendations`: optional optimization suggestions.
- **Relationships**:
  - Derived from environment data plus supplemental backend datasets.
- **Validation rules**:
  - Core environment counts and recent items should remain renderable even if cost or recommendation data is unavailable.

## Administrative Record
- **Purpose**: Represents data surfaced in admin-only screens.
- **Subtypes**:
  - **User Record**: identity, status, memberships, and assigned roles.
  - **Team Record**: team identity, members, and related actions.
  - **Role Record**: role identity, permission grouping, and assignments.
  - **Audit Record**: actor, action, resource, outcome, and timestamp.
- **Relationships**:
  - Available only to authorized admin users.
- **Validation rules**:
  - Admin datasets and actions must never render for unauthorized users.
  - Mutations must refresh visible data before the UI treats them as successful.

## API Key Record
- **Purpose**: Represents a user-managed automation credential shown in settings.
- **Fields**:
  - `id`: key identifier.
  - `name`: display name.
  - `prefix`: masked public prefix.
  - `createdAt`: creation timestamp.
  - `expiresAt`: optional expiration timestamp.
  - `lastUsedAt`: optional recent-use timestamp.
  - `status`: active or revoked state.
- **Relationships**:
  - Belongs to one portal user.
- **Validation rules**:
  - Secret values are only shown at creation time if provided by the backend flow.
  - Revoked keys must no longer appear as active.
