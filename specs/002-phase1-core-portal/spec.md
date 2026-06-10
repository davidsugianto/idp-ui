# Feature Specification: IDP UI Phase 1 Core Portal

**Feature Branch**: `001-frontend-phase1-spec`

**Created**: 2026-06-05

**Status**: Draft

**Input**: User description: "@docs/prd/PRD_PHASE_1.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access the core portal (Priority: P1)

A developer can sign in to the portal, reach protected pages, keep their session across normal browser refreshes, and be redirected back to sign in when the session is no longer valid.

**Why this priority**: Every other Phase 1 workflow depends on reliable portal access and protected navigation.

**Independent Test**: Sign in as a valid user, land on a protected page, refresh the browser, then simulate an expired session and confirm the user is redirected back to sign in.

**Acceptance Scenarios**:

1. **Given** a signed-out user opens a protected route, **When** the portal checks access, **Then** the user is directed into the sign-in flow instead of seeing protected content.
2. **Given** a valid signed-in session, **When** the user refreshes the browser on a protected page, **Then** the page reloads without forcing the user through a new sign-in flow.
3. **Given** a session expires while the user is active, **When** the user continues navigating or loading data, **Then** the portal clearly redirects the user back to sign in.
4. **Given** the user chooses to end their session, **When** they sign out, **Then** protected pages are no longer accessible until they sign in again.

---

### User Story 2 - Monitor and manage environments (Priority: P1)

A developer can use the dashboard and environment pages to understand current environments, find a specific environment, inspect details and workloads, and trigger key environment actions from the UI.

**Why this priority**: Environment visibility and self-service management are the core value of the Phase 1 portal.

**Independent Test**: Sign in as a developer, view the dashboard, open the environment browser, filter/search for an environment, open its detail page, and trigger a synchronization action.

**Acceptance Scenarios**:

1. **Given** a developer opens the landing page, **When** dashboard data is available, **Then** the page shows environment summary information and recent environments that can be opened directly.
2. **Given** a developer needs a specific environment, **When** they use search or filters in the environment browser, **Then** the visible results narrow to matching environments.
3. **Given** a developer opens an environment detail page, **When** the page loads successfully, **Then** the portal shows environment metadata and workload information in clearly separated sections.
4. **Given** an environment supports synchronization, **When** the developer triggers that action, **Then** the portal confirms the request and refreshes relevant environment information.
5. **Given** dashboard or environment data is partially unavailable, **When** the page renders, **Then** the user still sees a non-broken page with clear loading, empty, or error states for the missing sections.

---

### User Story 3 - Create environments through the UI (Priority: P2)

A developer can create a new environment through a guided UI flow, correct invalid input before submission, and land in the appropriate follow-up view after success.

**Why this priority**: Creating environments is a primary self-service workflow, but users still gain value from authentication and environment visibility before creation is available.

**Independent Test**: Sign in as a developer, complete the create-environment flow with valid input, submit it successfully, and confirm the portal takes the user to the intended success destination.

**Acceptance Scenarios**:

1. **Given** a developer starts the creation flow, **When** they move through the steps, **Then** the portal presents the required inputs in a clear guided sequence.
2. **Given** required or invalid input is present, **When** the developer attempts to continue or submit, **Then** the portal highlights what must be corrected before the flow can proceed.
3. **Given** the environment creation request succeeds, **When** the flow completes, **Then** the user is taken to the new environment or an equivalent success state.
4. **Given** the developer leaves the creation flow before submitting, **When** they navigate away, **Then** the portal does not leave them in a broken or ambiguous state.

---

### User Story 4 - Perform platform administration (Priority: P3)

A platform administrator can access admin-only areas to manage users, teams, roles, and audit records, while non-admin users are blocked from those pages.

**Why this priority**: Administrative workflows are part of Phase 1 scope, but they depend on the core portal, authentication, and navigation model already existing.

**Independent Test**: Sign in as an admin and confirm admin screens load with management capabilities, then sign in as a non-admin and confirm those same routes are blocked or redirected.

**Acceptance Scenarios**:

1. **Given** an authorized administrator opens admin pages, **When** the portal loads those routes, **Then** the user can access management views for users, teams, roles, and audit logs.
2. **Given** a non-admin user attempts to open an admin-only route, **When** access is evaluated, **Then** the portal blocks or redirects that user away from the admin area.
3. **Given** admin data is unavailable, **When** an authorized administrator opens an admin page, **Then** the portal shows a non-broken error or empty state instead of a blank or unusable screen.

### Edge Cases

- What happens when the dashboard can load environment counts but supporting cost or recommendation data is unavailable?
- What happens when an environment detail page loads successfully but workload data fails to load?
- What happens when a synchronization or deletion request is made for an environment whose state changed immediately beforehand?
- What happens when a user with an expired session tries to open an admin-only route directly?
- What happens when a developer has no environments yet and lands on the dashboard or environment browser?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a sign-in flow for portal users and prevent unauthenticated access to protected routes.
- **FR-002**: The system MUST preserve authenticated access across normal browser refreshes during a valid session.
- **FR-003**: The system MUST redirect users back to sign in when their session is no longer valid.
- **FR-004**: The system MUST allow users to sign out and end access to protected routes.
- **FR-005**: The system MUST provide a landing page that summarizes environment information relevant to the signed-in user.
- **FR-006**: The system MUST allow users to open a recent environment from the landing page.
- **FR-007**: The system MUST provide clear loading, empty, error, and unauthorized states for user-facing screens where relevant.
- **FR-008**: The system MUST provide an environment browser that lists environments visible to the signed-in user.
- **FR-009**: The system MUST allow users to narrow the environment list through search and filtering controls.
- **FR-010**: The system MUST provide an environment detail view with key metadata and workload visibility.
- **FR-011**: The system MUST allow users to trigger an environment synchronization action from the portal.
- **FR-012**: The system MUST confirm the outcome of environment actions and refresh affected views appropriately.
- **FR-013**: The system MUST provide a guided environment creation flow with validation before submission.
- **FR-014**: The system MUST route users to an appropriate success destination after successful environment creation.
- **FR-015**: The system MUST restrict admin-only routes and actions to authorized administrators.
- **FR-016**: The system MUST provide admin views for managing users, teams, roles, and audit records within Phase 1 scope.
- **FR-017**: The system MUST provide settings access for signed-in users, including API key management within Phase 1 scope.
- **FR-018**: The system MUST provide consistent primary navigation across dashboard, environments, settings, and admin areas.
- **FR-019**: The system MUST support desktop and tablet usage for all Phase 1 pages.
- **FR-020**: The system MUST keep Phase 2 and Phase 3 roadmap features out of current implementation scope unless the specification is amended.

### Key Entities *(include if feature involves data)*

- **Portal User**: A signed-in person using the frontend portal, including both standard developers and administrators with elevated permissions.
- **Auth Session**: The active access state that determines whether protected routes can render and whether the user must reauthenticate.
- **Environment**: A managed deployment space presented in the portal with identifying information, lifecycle status, ownership context, source metadata, and timestamps.
- **Workload**: A runtime unit belonging to an environment that communicates health, readiness, and deployment details.
- **Dashboard Summary**: Aggregated information shown on the landing page, including counts, recent environments, alerts, costs, or recommendations.
- **Administrative Record**: Platform management data shown in admin areas, including user, team, role, and audit-log information.
- **API Key Record**: A user-managed credential entry shown in settings for automation and CI/CD access management.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of successful sign-in attempts take users from the authentication flow to a usable protected page without a visible redirect loop or manual retry.
- **SC-002**: 90% of users in acceptance testing can identify their environment count and open a recent environment from the dashboard on the first attempt.
- **SC-003**: 90% of users in acceptance testing can find a target environment via browsing, search, or filtering and open its detail page without external assistance.
- **SC-004**: 90% of valid environment creation attempts submitted through the portal complete successfully and place the user in the intended follow-up view.
- **SC-005**: 100% of tested admin-only routes reject access for non-admin users during role-based acceptance validation.
- **SC-006**: All Phase 1 pages present a non-broken loading, empty, error, or unauthorized state when required data or access is unavailable.
- **SC-007**: Phase 1 pages achieve a Lighthouse score above 90 for the agreed page load performance target defined in the PRD.

## Assumptions

- `docs/prd/PRD_PHASE_1.md` is the primary source of truth for current scope and takes precedence over broader roadmap references when there is no explicit amendment.
- This specification covers the frontend `idp-ui` repository only; backend implementation inside `idp-core` remains out of scope except where it affects user-visible behavior.
- Authentication uses the existing OIDC-based backend flow described in the Phase 1 PRD.
- Settings and API key management are included in Phase 1 scope even if they are lower priority than dashboard, environment, and auth journeys.
- Desktop and tablet responsiveness are in scope for Phase 1; mobile-first optimization is not a primary requirement for this phase.
- Dashboard cost and recommendation sections are valuable but the portal remains usable when those supplemental datasets are temporarily unavailable.
