# Feature Specification: Template Management & Multi-Cluster Placement

**Feature Branch**: `004-template-placement`

**Created**: 2026-06-10

**Status**: Draft

**Input**: User description: "Update project to create template management and Multi-Cluster Placement delivery target to support request K8s environments"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse and inspect reusable templates (Priority: P1)

Platform users need to discover available environment templates, review their versions and parameters, and understand which templates are suitable for their team before creating an environment.

**Why this priority**: Template selection is a prerequisite for the guided environment creation flow. Users cannot make informed placement decisions without first seeing what templates exist, what parameters they require, and which versions are stable.

**Independent Test**: A user navigates to the template catalog, sees available templates with their categories and latest versions, drills into a template to view its version history and parameter definitions, and confirms the information helps them decide which template to use.

**Acceptance Scenarios**:

1. **Given** templates exist in the system, **When** a user navigates to the template list, **Then** they see each template's name, category, latest stable version, and description.
2. **Given** a template list is displayed, **When** no templates exist, **Then** the user sees a clear empty state with guidance on how templates become available.
3. **Given** a template has multiple versions, **When** a user views template details, **Then** they see the version history with stable/latest markers, parameter definitions, and resource requirements.
4. **Given** template data fails to load, **When** a user views the template list or detail, **Then** they see a retryable error state with clear messaging.

---

### User Story 2 - View and assess delivery targets for placement (Priority: P1)

Platform users need to see which clusters are available for environment placement, understand their health and capacity, and make informed targeting decisions when creating or moving environments.

**Why this priority**: Delivery target availability is a hard dependency for environment creation. Users must know which targets are healthy and accepting new environments before they can complete the creation flow.

**Independent Test**: A user navigates to the delivery targets view, sees each target's display name, purpose, availability state, and health state, and can distinguish available targets from unavailable ones.

**Acceptance Scenarios**:

1. **Given** delivery targets are registered, **When** a user views the target list, **Then** they see each target's display name, purpose, cluster name, availability state, and health state.
2. **Given** a target is marked unavailable or degraded, **When** displayed in the list, **Then** its status is visually distinct and the user understands it cannot be selected for new environments.
3. **Given** delivery target data fails to load, **When** a user views the target list, **Then** they see a retryable error state.
4. **Given** no delivery targets are registered, **When** a user views the list, **Then** they see a clear empty state explaining that placement targets must be configured by an administrator.

---

### User Story 3 - Administer templates (Priority: P2)

Administrators need to create, update, and manage template definitions and their versions so that the platform offers a curated set of reusable environment configurations.

**Why this priority**: While templates can be pre-seeded or created via API, a management UI enables platform administrators to maintain the template catalog without direct API access.

**Independent Test**: An administrator creates a new template with a name, description, and category, then publishes a version with parameters and resource definitions, and verifies the template appears in the user-facing catalog.

**Acceptance Scenarios**:

1. **Given** an administrator is authenticated, **When** they access template management, **Then** they can create a new template with name, description, category, and visibility settings.
2. **Given** a template exists, **When** an administrator publishes a new version, **Then** they can define version number, stability flag, parameter definitions with types and defaults, and resource specifications.
3. **Given** a template version exists, **When** an administrator edits parameters or resources, **Then** the changes are saved and reflected in the version details.
4. **Given** an administrator deletes a template, **When** no environments depend on it, **Then** the template is removed from the catalog. **When** environments reference it, **Then** the deletion is prevented with a clear explanation.

---

### User Story 4 - Administer delivery targets (Priority: P2)

Administrators need to register, update, and manage delivery targets so that the platform can offer multi-cluster placement for environments.

**Why this priority**: Delivery targets must be registered before users can place environments on them. An admin UI enables platform operators to maintain the target inventory.

**Independent Test**: An administrator registers a new delivery target with cluster connection details, sets its availability state, and verifies it appears in the user-facing target list and environment creation flow.

**Acceptance Scenarios**:

1. **Given** an administrator is authenticated, **When** they access target management, **Then** they can register a new delivery target with name, display name, purpose, cluster server, and availability state.
2. **Given** a delivery target exists, **When** an administrator updates its availability or health state, **Then** the change is immediately reflected in the user-facing target list.
3. **Given** a delivery target is deleted, **When** no environments are placed on it, **Then** it is removed. **When** environments are placed on it, **Then** deletion is prevented with a clear explanation.

---

### User Story 5 - Template and placement context in environment creation (Priority: P3)

When creating an environment, users need the template and delivery-target selections to be informed by the catalog and target data they have already browsed, with consistent availability and validation across the flow.

**Why this priority**: This integrates the standalone template and placement views with the existing create-environment wizard. The wizard already supports template and delivery-target selection from spec 003; this story ensures the selections are consistent with the standalone catalog and target views.

**Independent Test**: A user browses templates and targets, then starts the environment creation flow. The same templates and available targets appear in the wizard dropdowns. Selecting a template version shows the same parameter inputs seen in the template detail view.

**Acceptance Scenarios**:

1. **Given** a user has viewed templates in the catalog, **When** they open the create-environment wizard, **Then** the same templates and versions are available for selection.
2. **Given** a user selects a template version in the wizard, **When** the version has parameters, **Then** the wizard shows the same parameter inputs (names, types, defaults, required flags) as the template detail view.
3. **Given** a delivery target is unavailable, **When** the user reaches the placement step in the wizard, **Then** the target is shown as disabled with its unavailability reason visible.

---

### Edge Cases

The following edge cases are identified for future iterations. The initial release handles them with graceful degradation (stale data may display until next page load) rather than real-time reactivity.

- What happens when a template version is deprecated or marked unstable after a user has selected it in a draft environment? *(Deferred: requires real-time template version status polling)*
- How does the UI handle template deletion when environments were historically created from that template? *(Covered: FR-008 prevents deletion with 409 explanation)*
- What happens when a delivery target transitions from available to unavailable while a user is mid-way through the creation wizard? *(Deferred: requires WebSocket/SSE target state subscription)*
- How does the UI display delivery targets with partial capacity (some resources available, others exhausted)? *(Covered: capacity summary shown on detail page per FR-003)*
- What happens when a user lacks team access to a template marked as team-scoped? *(Deferred: requires team-scope filtering in the API query; currently all visible templates are shown)*

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a browsable template catalog with name, category, description, and latest stable version for each template.
- **FR-002**: System MUST display template detail including version history, parameter definitions (name, type, default, required flag), and resource requirements.
- **FR-003**: System MUST display a delivery target list with display name, purpose, cluster name, availability state, and health state.
- **FR-004**: System MUST visually distinguish available targets from unavailable or degraded targets.
- **FR-005**: Administrators MUST be able to create and delete templates. Template metadata updates are deferred to a later iteration (the idp-core API supports PATCH but the initial UI release focuses on create, publish versions, and delete).
- **FR-006**: Administrators MUST be able to publish new template versions with parameters and resources. Editing existing version metadata, parameters, or resources is deferred to a later iteration (the idp-core API supports PUT for parameters/resources but the initial UI release focuses on creating new versions).
- **FR-007**: Administrators MUST be able to register new delivery targets, toggle their availability state, and delete them. Full target metadata editing is deferred to a later iteration.
- **FR-008**: System MUST prevent deletion of templates or delivery targets that are referenced by existing environments, with a clear explanation.
- **FR-009**: System MUST provide loading, empty, error, and unauthorized states for all template and delivery-target views.
- **FR-010**: Template and delivery-target selections in the environment creation wizard MUST be consistent with the standalone catalog and target views.
- **FR-011**: System MUST restrict template and delivery-target administration to users with admin roles.
- **FR-012**: System MUST show template version parameter inputs in the environment creation wizard that match the parameter definitions from the selected version.

### Key Entities

- **Template**: A reusable environment definition with name, description, category, author, visibility scope, and associated versions.
- **Template Version**: A numbered release of a template with stability flag, parameter definitions (name, type, default, required, validation), and resource specifications.
- **Delivery Target**: A registered Kubernetes cluster available for environment placement, with name, display name, purpose, cluster server, availability state, and health state.
- **Template Parameter**: A configurable input defined on a template version, with name, display name, type, default value, and required flag.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can browse the full template catalog and view template details in under 10 seconds on a standard connection.
- **SC-002**: Users can identify available versus unavailable delivery targets at a glance without reading detailed status text.
- **SC-003**: Administrators can publish a new template version with parameters in under 3 minutes.
- **SC-004**: 95% of template and delivery-target list loads complete without user-facing errors.
- **SC-005**: After browsing the template catalog, users can start environment creation and see the same templates, versions, parameters, and delivery targets available for selection in the wizard dropdowns that they saw in the standalone views.

## Assumptions

- The backend idp-core API provides the template and delivery-target endpoints documented in its README and quickstart.
- Authentication and role-based access control are already in place via the existing auth system.
- The existing environment creation wizard (from spec 003) already supports template and delivery-target selection and will be extended rather than replaced.
- Template and delivery-target write operations (create, update, delete) are restricted to admin users, matching the existing AdminRoute guard pattern.
- Delivery targets are pre-registered by platform administrators; self-service target registration by non-admin users is out of scope.
- Template metadata editing (PATCH), template version editing (PATCH), parameter/resource replacement (PUT), and full delivery-target metadata editing (PATCH) are deferred to a later iteration. The initial release focuses on create, read, delete, and availability-toggle operations.