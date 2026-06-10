# Research: Backend API UI Alignment

## Decision 1: Treat the current `idp-core` Phase 3 create-environment contract as the frontend source of truth
- **Decision**: Plan the UI against the Phase 3 backend contract in `idp-core`, specifically the `POST /v1/environments` additions for `template_version_id`, `template_inputs`, and `delivery_target_id`, plus the related delivery-target availability and failure semantics.
- **Rationale**: The current frontend still models the older environment-creation shape around `cluster_name` and generic source fields. The active feature spec and constitution now require the UI to follow the external backend contract instead of preserving parallel frontend-only assumptions.
- **Alternatives considered**:
  - Keep the legacy frontend payload and wait for a later migration — rejected because the user explicitly flagged the create-environment flow as failing now.
  - Add temporary compatibility shims in components — rejected because it would spread backend drift across the UI and conflict with service-boundary discipline.

## Decision 2: Keep the existing multi-step wizard and React Hook Form architecture, but change its fields and review semantics
- **Decision**: Reuse `EnvironmentCreatePage.tsx` and `EnvironmentCreateWizard.tsx` as the guided shell for the updated flow, extending the wizard to collect backend-aligned placement and template context rather than replacing the journey with a brand-new interaction model.
- **Rationale**: The spec assumes the current journey remains a guided multi-step experience. The existing page already preserves local draft state, step gating, review, and leave-confirmation behavior, so the lowest-risk path is to update the inputs and error handling inside that structure.
- **Alternatives considered**:
  - Replace the flow with a single large form — rejected because it weakens the current guided review experience.
  - Introduce a new form framework or a full Ant Design Pro step-flow migration now — rejected because the feature is contract alignment, not shell refactoring.

## Decision 3: Load backend-backed template and delivery-target options through React Query hooks and service functions
- **Decision**: Fetch selectable template and delivery-target data through `src/services/` and query hooks, then present those options in the wizard with clear loading, empty, unavailable, and retry states.
- **Rationale**: The backend contract makes placement validity and template context backend-owned. The constitution requires frontend components to consume async data through service functions and React Query rather than direct transport access.
- **Alternatives considered**:
  - Hardcode delivery-target options in the UI — rejected because availability and authorization are backend-owned and can change.
  - Delay rendering the step until all async data succeeds silently — rejected because the feature requires explicit degraded-data behavior.

## Decision 4: Preserve the form draft on all recoverable mutation failures and map backend errors into actionable UI messaging
- **Decision**: Keep the submitted values in React Hook Form state after failed submissions and translate backend failures into user-facing messages that distinguish validation, permission, availability, and conflict outcomes.
- **Rationale**: Both the feature spec and constitution explicitly require preserving user-entered data and providing clear recovery paths near the action. The current page only surfaces a generic top-level mutation error string, which is insufficient for the new backend contract.
- **Alternatives considered**:
  - Clear the form after any submit attempt — rejected because it forces re-entry and violates the spec.
  - Show only a generic toast or banner — rejected because it does not tell the user whether to correct inputs, retry later, or request access.

## Decision 5: Keep unsupported or unavailable placement options visibly non-selectable instead of hiding backend constraints
- **Decision**: Surface delivery targets and template-dependent requirements in a way that shows when an option is unavailable, unauthorized, or absent, and prevent users from selecting guaranteed-failure combinations.
- **Rationale**: The spec requires the UI to stop unsupported platform options from appearing selectable when the backend will certainly reject them. The backend quickstart also explicitly calls out that unavailable targets must not be selectable.
- **Alternatives considered**:
  - Hide unavailable options entirely — rejected because users may need to understand why a previously expected target is not usable.
  - Allow selection and rely on submit-time rejection — rejected because it produces avoidable backend errors.

## Decision 6: Validate the feature primarily through route-level environment-flow coverage and manual browser checks
- **Decision**: Extend the existing environment route integration coverage and quickstart scenarios to exercise the aligned create-environment flow, including success, invalid input, unavailable data, and backend rejection cases, then finish with browser validation.
- **Rationale**: The highest-risk regressions are at the seams between routing, async option loading, form validation, and mutation failure handling. Route-level validation best matches the user journey and constitution requirements.
- **Alternatives considered**:
  - Rely only on service-level tests — rejected because they would miss step-flow and recovery behavior.
  - Skip manual browser validation — rejected because the constitution requires browser verification for UI work.
