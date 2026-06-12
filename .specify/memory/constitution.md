<!--
Sync Impact Report
- Version change: 1.0.1 → 1.1.0
- Modified principles:
  - III. Contract-Driven Backend Integration → strengthened language to require template and delivery-target contracts as mandatory (not optional) context for environment creation
- Added sections:
  - VI. Template and Placement as First-Class Dependencies (new principle)
- Removed sections:
  - None
- Templates requiring updates:
  - ✅ updated: .specify/templates/plan-template.md (Constitution Check now includes template/placement governance gate)
  - ✅ aligned: .specify/templates/spec-template.md (no changes required)
  - ✅ aligned: .specify/templates/tasks-template.md (no changes required)
  - ⚠ pending: .specify/templates/commands/ (directory not present in this repository)
- Follow-up TODOs:
  - None
-->

# IDP UI Constitution

## Core Principles

### I. User-Journey First Delivery
Every scoped feature MUST be described and delivered as independently testable user
journeys ordered by business priority. Specifications, plans, and task lists MUST keep
MVP slices clear so the team can ship dashboard, environment, auth, and admin flows
incrementally without coupling all work into a single release gate.

Rationale: The PRD is phase-based and success is measured by adoption of concrete
self-service workflows, not by internal subsystem completion.

### II. Frontend Boundary Discipline
All backend communication MUST flow through `src/services/`. Components and pages MUST
consume backend data through service functions and query hooks rather than calling
transport clients directly. Server-originated async data MUST use React Query patterns,
shared client session and UI state MUST use Zustand stores, and component-local state
MUST stay local unless multiple routes or shells depend on it.

Rationale: The repository is a frontend SPA that integrates with an external backend.
Clear boundaries keep API drift, caching behavior, and shared state changes localized.

### III. Contract-Driven Backend Integration
`idp-core` MUST be treated as an external system of record. Any feature that depends on
backend behavior MUST document the frontend-facing contract in specs or plan artifacts,
including required fields, authorization expectations, degraded-data behavior, and
failure modes. When `idp-core` contracts already exist, UI flows MUST align with those
contracts instead of inventing parallel assumptions. For environment creation, this
means the UI MUST treat `template_version_id`, `template_inputs`, and
`delivery_target_id` as mandatory placement inputs when the backend contract requires
them, and MUST validate availability and version existence before submission. For the
full Phase 3 platform surface, this explicitly includes template management,
delivery-target selection, environment creation, environment movement, notifications,
and authenticated event/log streams.

Rationale: The product vision depends on a separate backend repository, so predictable
contracts matter more than shared implementation assumptions. The quickstart validation
in `idp-core` demonstrates that template version and delivery target are required
placement inputs for environment creation.

### IV. Verification Before Merge
Changes MUST pass `npm run lint`, `npm run typecheck`, `npm run test`, and
`npm run build` before they are considered ready. Any change that affects protected
routing, authentication state, environment mutations, or admin authorization MUST add or
update route-level integration coverage. UI work MUST also be manually validated in the
browser for the primary journey and relevant failure states.

Rationale: The portal mixes auth, routing, and async backend data; regressions usually
appear at integration seams rather than in isolated units.

### V. Resilient and Accessible UX
User-facing screens MUST provide non-broken loading, empty, error, and unauthorized
states. Phase 1 work MUST support desktop and tablet layouts, preserve clear navigation,
and keep admin-only functionality inaccessible to unauthorized users. New workflows MUST
prefer explicit recovery paths over silent failure. Mutation flows MUST surface backend
validation or authorization failures with actionable messaging near the user action,
and create/update forms MUST preserve user input whenever recovery is possible.

Rationale: The PRD measures success by adoption and satisfaction, which depend on
reliable, comprehensible behavior under normal and degraded conditions.

### VI. Template and Placement as First-Class Dependencies
Environment creation MUST treat template and delivery-target selection as first-class
placement dependencies, not optional add-ons. The create-environment flow MUST validate
template version existence and delivery-target availability before submission, aligning
with the backend contract where `template_version_id`, `template_inputs`, and
`delivery_target_id` are required placement inputs. Template parameter inputs MUST be
collected and validated per the selected version's parameter definitions. Delivery
targets marked unavailable or unhealthy MUST be visibly disabled in the placement UI
rather than silently filtered, so users understand why a target cannot be selected.
Template and delivery-target data loading failures MUST surface retryable error states
without blocking the rest of the create-environment flow.

Rationale: The `idp-core` Phase 3 backend makes templates and delivery targets
mandatory placement context for environment creation. The UI must reflect this
dependency clearly so users understand the relationship and can recover when
placement data is degraded.

## Additional Constraints

- The canonical frontend stack is TypeScript, React, Vite, Ant Design, React Router,
  React Query, Zustand, React Hook Form, Zod, Axios, and Vitest.
- Page-level features MUST live under `src/pages/` with supporting shared UI in
  `src/components/`, domain types in `src/types/`, services in `src/services/`, and
  stores in `src/stores/`.
- This repository owns frontend behavior only. Backend implementation, infrastructure,
  and cross-repo changes belong in `idp-core` or other systems unless explicitly
  documented as external dependencies.
- Phase scope MUST follow the PRD roadmap. Features planned for later phases MAY be
  referenced in documentation, but they MUST not be introduced into current scope
  without a corresponding spec update.

## Delivery Workflow

- New work MUST start from a feature specification grounded in the PRD and then move
  through plan, tasks, and implementation artifacts.
- Plans MUST include a constitution check that verifies service-boundary discipline,
  state-management choices, contract updates, validation strategy, and UX resilience.
- Task lists MUST be organized by user story so each journey can be implemented and
  tested independently.
- When backend dependencies change, the affected contract artifact and quickstart
  validation steps MUST be updated in the same planning cycle.
- For create, move, sync, and other user-triggered mutations, plans and tasks MUST call
  out expected backend error handling and the intended user recovery path.
- When environment creation depends on template or delivery-target data, plans and tasks
  MUST validate that the UI fetches, displays, and validates template version existence
  and delivery-target availability before submission, and MUST include degraded-data
  recovery paths for option-load failures.
- Reviews MUST check both code changes and supporting artifacts for compliance with this
  constitution.

## Governance

This constitution supersedes conflicting planning or workflow habits for the `idp-ui`
repository. Amendments require: (1) updating this file, (2) adding a Sync Impact Report
at the top describing downstream effects, and (3) propagating required changes to
relevant templates and runtime guidance files.

Versioning policy follows semantic versioning:
- MAJOR for removing or redefining a principle in a backward-incompatible way.
- MINOR for adding a new principle or materially expanding governance requirements.
- PATCH for clarifications or non-semantic wording improvements.

Compliance review expectations:
- Plans MUST pass the constitution check before implementation begins.
- Tasks MUST preserve user-journey slicing and required validation work.
- Reviews and pre-merge validation MUST confirm the required commands and browser
  validation were completed.

**Version**: 1.1.0 | **Ratified**: 2026-06-05 | **Last Amended**: 2026-06-10