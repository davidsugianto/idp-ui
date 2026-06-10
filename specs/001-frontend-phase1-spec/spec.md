# Feature Specification: IDP UI Phase 1 Core Portal

**Feature Branch**: `001-frontend-phase1-spec`

**Created**: 2026-06-05

**Status**: Draft

**Input**: User description: "Read my existing PRD and dev todolist in @docs/ and this is for the separate repo for idp project; this is frontend idp-ui, and the backend is idp-core"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access the core portal (Priority: P1)

A platform user can sign in to the frontend portal, land on the main workspace, and keep access to protected pages without repeatedly signing in during normal use.

**Why this priority**: No dashboard, environment management, or admin workflow is valuable unless users can access the portal reliably.

**Independent Test**: Can be fully tested by signing in, loading the landing page, refreshing the browser, and confirming protected pages remain accessible until the session ends.

**Acceptance Scenarios**:

1. **Given** a signed-out user visits a protected page, **When** they are prompted to sign in and complete sign-in successfully, **Then** they are taken into the portal instead of remaining on the sign-in page.
2. **Given** a signed-in user refreshes the browser during an active session, **When** the application reloads, **Then** the user remains signed in and sees protected content without a visible redirect loop.
3. **Given** a user session expires or becomes invalid, **When** the user attempts to continue using the portal, **Then** the application redirects them to sign in again in a clear and controlled way.

---

### User Story 2 - Monitor environments from a dashboard (Priority: P1)

A developer can open the landing page and immediately understand how many environments they have, which ones need attention, and which recent environments they can jump into.

**Why this priority**: The dashboard is the main entry point for the portal and provides the fastest path to awareness and navigation.

**Independent Test**: Can be fully tested by signing in, loading the landing page with environment data available, and verifying that summary information and recent items are visible and understandable.

**Acceptance Scenarios**:

1. **Given** a signed-in developer with existing environments, **When** they open the landing page, **Then** they see summary indicators for environment count and status at a glance.
2. **Given** recent environments exist, **When** the landing page loads, **Then** the user can identify and open a recent environment from the dashboard.
3. **Given** no environment data is available or loading fails, **When** the landing page loads, **Then** the user sees a clear empty or error state instead of a broken layout.

---

### User Story 3 - Browse and inspect environments (Priority: P1)

A developer can browse their environments, narrow the visible list, open an environment, and inspect its key metadata and workloads from the frontend.

**Why this priority**: Environment visibility is the core operational value of the portal and is central to self-service usage.

**Independent Test**: Can be fully tested by opening the environment list, filtering or searching for an environment, opening its detail view, and confirming workload information is shown.

**Acceptance Scenarios**:

1. **Given** a developer has multiple environments, **When** they open the environment browser, **Then** they see a list of environments with enough context to distinguish them.
2. **Given** a developer wants a specific environment, **When** they use available filters or search, **Then** the visible results narrow to matching environments.
3. **Given** a developer opens an environment detail view, **When** the page loads, **Then** they see environment metadata and workload information in dedicated sections.
4. **Given** an environment can be synchronized, **When** the developer triggers a sync action, **Then** the portal confirms the action and refreshes relevant environment information.

---

### User Story 4 - Create environments through the UI (Priority: P2)

A developer can create a new environment through a guided frontend flow instead of relying only on direct backend or API usage.

**Why this priority**: Creation is a major self-service workflow, but the portal still provides value before this is available because users can already sign in, monitor, and inspect environments.

**Independent Test**: Can be fully tested by completing the creation flow with valid input, submitting it, and confirming the user lands on the new environment view or a clear confirmation outcome.

**Acceptance Scenarios**:

1. **Given** a developer wants a new environment, **When** they start the create flow, **Then** they are guided through the required inputs in a clear sequence.
2. **Given** required information is missing or invalid, **When** the developer attempts to continue, **Then** the portal highlights what must be corrected before submission.
3. **Given** environment creation succeeds, **When** the flow completes, **Then** the user is taken to the newly created environment or an equivalent success destination.

---

### User Story 5 - Perform platform administration from the UI (Priority: P3)

A platform administrator can use the portal to manage users, teams, roles, and audit information without switching to direct backend operations.

**Why this priority**: Administrative capability is important for the overall Phase 1 portal, but it depends on the core portal, dashboard, and environment workflows already existing.

**Independent Test**: Can be fully tested by signing in as an administrator, opening admin-only areas, and confirming that management views and actions are available only to authorized users.

**Acceptance Scenarios**:

1. **Given** an administrator is signed in, **When** they open admin areas, **Then** they can access management screens for users, teams, roles, and audit information.
2. **Given** a non-administrator is signed in, **When** they attempt to access admin-only pages, **Then** access is blocked or redirected appropriately.

### Edge Cases

- What happens when a signed-in user has no environments yet?
- How does the portal behave when an environment loads successfully but workload data fails to load?
- What happens when a sync or delete action is requested for an environment that has already changed state?
- How does the portal respond when a create flow is abandoned midway and the user navigates away?
- What happens when dashboard summary data is available but recommendation or cost data is temporarily unavailable?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a sign-in experience for portal users and prevent unauthenticated access to protected pages.
- **FR-002**: The system MUST preserve authenticated access across browser refreshes during a valid session.
- **FR-003**: The system MUST redirect users back to sign-in when their session is no longer valid.
- **FR-004**: The system MUST provide a landing page that summarizes the user’s environments and recent activity relevant to the portal.
- **FR-005**: The system MUST allow users to open a recent environment from the landing page.
- **FR-006**: The system MUST provide clear loading, empty, and error states for dashboard content.
- **FR-007**: The system MUST provide an environment browser that lists the user’s available environments.
- **FR-008**: The system MUST allow users to narrow the environment list using search and filtering controls.
- **FR-009**: The system MUST provide an environment detail view with key metadata, status information, and workload visibility.
- **FR-010**: The system MUST allow users to trigger an environment synchronization action from the frontend.
- **FR-011**: The system MUST confirm the outcome of a synchronization attempt and refresh affected environment views.
- **FR-012**: The system MUST provide a guided environment creation flow that validates required inputs before submission.
- **FR-013**: The system MUST return the user to an appropriate post-creation destination after a successful environment creation.
- **FR-014**: The system MUST restrict administrative pages and actions to authorized administrative users.
- **FR-015**: The system MUST provide frontend views for user, team, role, and audit management within the scope defined by Phase 1 planning materials.
- **FR-016**: The system MUST provide consistent navigation so users can move between dashboard, environments, settings, and admin areas from the main portal shell.
- **FR-017**: The system MUST present user-facing errors in a clear way that helps the user recover or retry.
- **FR-018**: The system MUST support desktop and tablet usage for all Phase 1 pages.

### Key Entities *(include if feature involves data)*

- **Portal User**: A signed-in person using the frontend portal, including standard developers and administrators with elevated access.
- **Environment**: A managed deployment space visible in the portal, including identity, status, ownership context, location context, and lifecycle timestamps.
- **Workload**: A runtime unit associated with an environment that communicates health or readiness information to the user.
- **Dashboard Summary**: Aggregated environment information presented on the landing page, such as counts, recent items, alerts, costs, or recommendations.
- **Administrative Record**: Managed platform data shown in admin areas, including users, teams, roles, and audit entries.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of successful sign-ins take users from the sign-in flow to a usable protected page without a visible redirect loop or manual retry.
- **SC-002**: Users can reach a specific environment detail page from the dashboard or environment browser in three interactions or fewer.
- **SC-003**: 90% of users in acceptance testing can identify the total number of their environments and locate a recent environment from the dashboard on the first attempt.
- **SC-004**: 90% of users in acceptance testing can complete the environment browsing flow, including filtering/searching and opening a detail page, without external assistance.
- **SC-005**: 90% of valid environment creation attempts submitted through the UI complete successfully and place the user in the expected follow-up view.
- **SC-006**: 100% of admin-only pages reject access for non-administrative users during role-based acceptance testing.
- **SC-007**: All Phase 1 pages present a non-broken loading, empty, or error state when required data is unavailable.

## Assumptions

- The documents in `docs/` are the primary source of truth for the intended scope of the frontend Phase 1 portal.
- This specification covers the frontend `idp-ui` repository only; backend APIs and backend implementation details are out of scope except where they affect user-visible behavior.
- The core portal shell, protected navigation model, and sign-in behavior remain part of the same Phase 1 experience rather than separate deliverables.
- Cost and recommendation information are included on the dashboard when available, but the rest of the dashboard remains usable if those supporting data sources are unavailable.
- Desktop and tablet responsiveness are in scope for Phase 1; mobile-specific optimization is not treated as a primary success requirement.
- The environment browser and creation flow serve users who already have permission to manage environments in the backend system.
