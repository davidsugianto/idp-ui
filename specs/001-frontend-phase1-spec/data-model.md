# Data Model: IDP UI Phase 1 Core Portal

## Portal User
- **Purpose**: Represents an authenticated person using the portal.
- **Fields**:
  - `id`: unique user identifier.
  - `name`: display name used in the UI shell.
  - `email`: contact/login identity.
  - `roles`: assigned authorization roles used for protected admin access.
  - `groups`: team or organizational memberships used for ownership context.
  - `isAuthenticated`: derived session state indicating whether protected routes may render.
- **Relationships**:
  - Can view and manage many environments, subject to backend permissions.
  - May have administrative privileges that unlock admin records and actions.
- **Validation rules**:
  - `id`, `name`, and `email` must be present for a hydrated authenticated profile.
  - `roles` and `groups` default to empty lists when not supplied.
- **State transitions**:
  - `signed_out` → `signing_in` → `authenticated`.
  - `authenticated` → `expired` when refresh or validation fails.
  - `authenticated` or `expired` → `signed_out` on logout.

## Auth Session
- **Purpose**: Captures frontend session state needed to keep protected pages available across navigation and refresh.
- **Fields**:
  - `authToken`: current access token used for authenticated requests.
  - `expiresIn`: token lifetime metadata used by the auth flow.
  - `hasHydratedAuth`: whether the app has finished checking persisted session state.
  - `isAuthenticated`: whether the session is currently usable.
- **Relationships**:
  - Belongs to one portal user when authenticated.
- **Validation rules**:
  - Token values must be present before authenticated API retries occur.
  - Hydration must complete before protected routes decide whether to render or redirect.
- **State transitions**:
  - `unhydrated` → `hydrated_authenticated` or `hydrated_signed_out`.
  - `hydrated_authenticated` → `refreshing` during token renewal.
  - `refreshing` → `hydrated_authenticated` on success, otherwise `hydrated_signed_out`.

## Environment
- **Purpose**: Represents a managed deployment environment shown in dashboard and environment pages.
- **Fields**:
  - `id`: unique environment identifier.
  - `teamId`: owning team reference.
  - `name`: human-readable environment name.
  - `description`: optional summary.
  - `namespace`: backing runtime namespace.
  - `status`: lifecycle status such as active, creating, deleting, inactive, or error.
  - `gitRepoUrl`: linked source repository.
  - `gitRevision`: linked branch, tag, or revision.
  - `manifestPath`: deployment manifest location.
  - `clusterName`: target cluster label.
  - `clusterServer`: optional cluster endpoint reference.
  - `resourceQuotaCpu`, `resourceQuotaMemory`: optional resource limits.
  - `labels`: optional metadata tags.
  - `ownerId`: optional owner user reference.
  - `expiresAt`: optional scheduled expiration.
  - `lastSyncAt`: most recent sync timestamp.
  - `lastError`: latest error detail when applicable.
  - `errorCount`: count of recent sync or provisioning failures.
  - `createdAt`, `updatedAt`: lifecycle timestamps.
- **Relationships**:
  - Can contain many workloads.
  - Is visible in dashboard summaries and recent environment lists.
  - Can be created, synchronized, or deleted by authorized users.
- **Validation rules**:
  - `id`, `teamId`, `name`, `namespace`, `status`, `gitRepoUrl`, `manifestPath`, `createdAt`, and `updatedAt` are required.
  - `status` must map to a supported UI lifecycle state.
  - Creation requires enough source and deployment information to produce a valid backend request.
- **State transitions**:
  - `creating` → `active` or `error`.
  - `active` → `deleting` during removal.
  - Any operational state → `error` when backend sync or provisioning fails.

## Environment Filter Query
- **Purpose**: Represents user-selected narrowing of the environment list.
- **Fields**:
  - `search`: free-text name search.
  - `status`: selected status filter or `all`.
  - Additional UI-level filter controls for team, cluster, sorting, and pagination as required by Phase 1 scope.
- **Relationships**:
  - Applied to the environment browser dataset.
- **Validation rules**:
  - Empty search values mean no text filtering.
  - Filter state must remain serializable and safe to reset.

## Workload
- **Purpose**: Represents an individual runtime workload belonging to an environment.
- **Fields**:
  - `name`: workload name.
  - `kind`: workload type.
  - `status`: runtime health or readiness status.
  - `desiredReplicas`: intended replica count.
  - `readyReplicas`: currently ready replicas.
  - `image`: deployed artifact reference.
- **Relationships**:
  - Belongs to one environment.
  - Appears inside workload summaries and environment detail views.
- **Validation rules**:
  - `name`, `kind`, and `status` are required.
  - Replica counts must be non-negative integers.

## Workload Status Summary
- **Purpose**: Aggregates health indicators for an environment’s workloads.
- **Fields**:
  - `environmentId`: referenced environment.
  - `namespace`: namespace the workloads run in.
  - `totalWorkloads`, `healthyWorkloads`, `degradedWorkloads`: workload health counts.
  - `totalPods`, `runningPods`, `pendingPods`, `failedPods`: pod health counts.
  - `workloads`: collection of workload entries.
- **Relationships**:
  - Belongs to one environment.
- **Validation rules**:
  - Aggregate counts must be internally consistent with workload results when both are present.
  - Missing summary data should fall back to an explicit error or empty state, not a broken view.

## Dashboard Summary
- **Purpose**: Aggregates the landing-page metrics and shortcuts needed for quick portal awareness.
- **Fields**:
  - `environmentCount`: total environments visible to the user.
  - `activeCount`: count of currently healthy or ready environments.
  - `alertCount`: environments or workloads needing attention.
  - `costSummary`: optional cost rollup.
  - `recentEnvironments`: recently updated or recently created environments.
  - `recommendations`: optional optimization or action suggestions.
- **Relationships**:
  - Derived from environment and supporting backend datasets.
- **Validation rules**:
  - At least the core environment summary and recent navigation paths must render when optional supporting data is unavailable.

## Administrative Record
- **Purpose**: Represents the backend-managed records surfaced in admin areas.
- **Subtypes**:
  - **User Record**: identity, status, team membership, and assigned roles.
  - **Team Record**: team identity, membership count, and related members.
  - **Role Record**: role identity, permission grouping, and assignment status.
  - **Audit Entry**: timestamped action record including actor, action, resource, and outcome.
- **Relationships**:
  - Accessible only to administrative portal users.
  - Linked to user and team management workflows.
- **Validation rules**:
  - Admin datasets must never be exposed to unauthorized users.
  - Management actions must reflect the backend result before the UI treats them as successful.
