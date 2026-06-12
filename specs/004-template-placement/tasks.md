# Tasks: Template Management & Multi-Cluster Placement

**Input**: Design documents from `/specs/004-template-placement/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include route-level integration coverage for admin mutation flows (template CRUD, delivery-target CRUD) and browsing flows (template catalog, target list). Finish with lint, typecheck, test, build, and browser validation for all new and updated pages.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single-project frontend app rooted at `src/`
- Route-level integration coverage in `src/__tests__/integration/`
- Backend communication only through `src/services/`
- Page modules under `src/pages/Templates/` and `src/pages/DeliveryTargets/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Extend types, constants, services, and hooks to support template and delivery-target data.

- [x] T001 [P] Add Template, TemplateVersion, TemplateParameter, TemplateResource, and DeliveryTarget types plus Zod validation schemas in `src/types/environment.ts`
- [x] T002 [P] Extend backend endpoint constants and query-key helpers for template CRUD, version CRUD, parameter/resource replacement, input validation, and delivery-target CRUD in `src/constants/api.ts`
- [x] T003 Implement template (list, get, create, delete), template-version (list, create, parameters, resources), and delivery-target (list, get, create, update, delete) service functions with snake_case→camelCase normalization in `src/services/environments.ts`
- [x] T004 Implement React Query hooks (`useTemplates`, `useTemplate`, `useTemplateVersions`, `useCreateTemplate`, `useCreateTemplateVersion`, `useDeliveryTargets`, `useDeliveryTarget`, `useCreateDeliveryTarget`, `useUpdateDeliveryTarget`, `useDeleteDeliveryTarget`, `useDeleteTemplate`) in `src/hooks/useEnvironments.ts`

**Checkpoint**: Template and delivery-target data flows from API through services and hooks — ready for UI work.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add routes and shared components that all user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T005 [P] Add route definitions for `/templates`, `/templates/:id`, `/admin/templates/new`, `/admin/templates/:id/versions/new`, `/delivery-targets`, `/delivery-targets/:id`, `/admin/delivery-targets/new` in `src/App.tsx`
- [x] T006 [P] Create shared `TemplateTable` component with loading, empty, and error states in `src/components/templates/TemplateTable.tsx`

**Checkpoint**: Routes and shared components ready — user story implementation can now begin.

---

## Phase 3: User Story 1 - Browse and inspect reusable templates (Priority: P1) 🎯 MVP

**Goal**: Let users discover templates, view version history, and inspect parameter definitions.

**Independent Test**: User navigates to `/templates`, sees the template catalog, clicks a template to view versions and parameters.

### Implementation for User Story 1

- [x] T007 [P] [US1] Add template catalog and template-detail integration test coverage in `src/__tests__/integration/template-catalog.test.tsx`
- [x] T008 [US1] Build `TemplateListPage` with catalog table, category filters, loading/empty/error states in `src/pages/Templates/TemplateListPage.tsx`
- [x] T009 [US1] Build `TemplateDetailPage` with version history, parameter definitions, resource specs, and loading/error states in `src/pages/Templates/TemplateDetailPage.tsx`

**Checkpoint**: Template catalog browsable and independently testable.

---

## Phase 4: User Story 2 - View and assess delivery targets for placement (Priority: P1)

**Goal**: Let users see available clusters, their health, and their capacity for placement decisions.

**Independent Test**: User navigates to `/delivery-targets`, sees the target list with availability and health indicators.

### Implementation for User Story 2

- [x] T010 [P] [US2] Add delivery-target list integration test coverage in `src/__tests__/integration/delivery-targets.test.tsx`
- [x] T011 [US2] Build `DeliveryTargetListPage` with status indicators (Tag/Badge for availability and health), loading/empty/error states in `src/pages/DeliveryTargets/DeliveryTargetListPage.tsx`
- [x] T012 [US2] Build `DeliveryTargetDetailPage` with full target metadata, capacity summary, loading/error states in `src/pages/DeliveryTargets/DeliveryTargetDetailPage.tsx`

**Checkpoint**: Delivery target list browsable and independently testable.

---

## Phase 5: User Story 3 - Administer templates (Priority: P2)

**Goal**: Let administrators create, update, and manage templates and their versions through the UI.

**Independent Test**: Admin creates a template, publishes a version with parameters, and verifies it appears in the catalog.

### Implementation for User Story 3

- [x] T013 [P] [US3] Add admin template-creation and version-publication integration test coverage in `src/__tests__/integration/template-catalog.test.tsx`
- [x] T014 [US3] Build `TemplateCreatePage` with React Hook Form + Zod validation, visibility/team-id conditional fields, and submit error handling in `src/pages/Templates/TemplateCreatePage.tsx`
- [x] T015 [US3] Build `TemplateVersionCreatePage` with version number, stability flags, dynamic parameter input rows (name, type, default, required), and resource input in `src/pages/Templates/TemplateVersionCreatePage.tsx`
- [x] T016 [US3] Wire admin-only route guard (`AdminRoute`) for `/admin/templates/new` and `/admin/templates/:id/versions/new` and add delete-template action with 409 conflict handling in `src/pages/Templates/TemplateDetailPage.tsx`

**Checkpoint**: Admin template CRUD functional and independently testable.

---

## Phase 6: User Story 4 - Administer delivery targets (Priority: P2)

**Goal**: Let administrators register, update, and manage delivery targets through the UI.

**Independent Test**: Admin registers a delivery target, updates its availability state, and verifies it appears in the user-facing target list.

### Implementation for User Story 4

- [x] T017 [P] [US4] Add admin delivery-target registration and update integration test coverage in `src/__tests__/integration/delivery-targets.test.tsx`
- [x] T018 [US4] Build `DeliveryTargetCreatePage` with React Hook Form + Zod validation, cluster connection fields, availability/health state selectors, and submit error handling in `src/pages/DeliveryTargets/DeliveryTargetCreatePage.tsx`
- [x] T019 [US4] Wire admin-only route guard (`AdminRoute`) for `/admin/delivery-targets/new`, add edit-availability inline action on detail page, and add delete-target action with 409 conflict handling in `src/pages/DeliveryTargets/DeliveryTargetDetailPage.tsx`

**Checkpoint**: Admin delivery-target CRUD functional and independently testable.

---

## Phase 7: User Story 5 - Template and placement context in environment creation (Priority: P3)

**Goal**: Ensure template and delivery-target selections in the create-environment wizard are consistent with the standalone catalog and target views.

**Independent Test**: User browses templates and targets in standalone views, then starts environment creation and sees the same options in the wizard dropdowns.

### Implementation for User Story 5

- [x] T020 [P] [US5] Add wizard-to-catalog consistency integration test coverage (same query cache, same options) in `src/__tests__/integration/environment-flow.test.tsx`
- [x] T021 [US5] Verify and update template dropdown, version dropdown, parameter inputs, and delivery-target dropdown in the Deployment step to use shared query-key cache from standalone catalog/target pages in `src/components/environments/EnvironmentCreateWizard.tsx`

**Checkpoint**: Catalog-to-wizard integration consistent and independently testable.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all user stories.

- [x] T022 Validate shared type, service, hook, and test consistency across `src/types/environment.ts`, `src/services/environments.ts`, `src/hooks/useEnvironments.ts`, `src/constants/api.ts`, and all new page/component files
- [x] T023 Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` for all changes
- [x] T024 Manually verify happy-path browser flows: template catalog browsing, version inspection, delivery-target list, admin template CRUD, admin target CRUD, wizard catalog consistency, and unauthorized/admin-gating states

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — blocks all user stories
- **US1 - Template Catalog (Phase 3)**: Depends on Foundational — P1 MVP
- **US2 - Delivery Targets (Phase 4)**: Depends on Foundational — P1, parallel with US1
- **US3 - Admin Templates (Phase 5)**: Depends on US1 (builds on catalog pages)
- **US4 - Admin Delivery Targets (Phase 6)**: Depends on US2 (builds on target pages)
- **US5 - Wizard Integration (Phase 7)**: Depends on US1 and US2 (needs catalog data)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1**: Can start after Phase 2
- **US2**: Can start after Phase 2 — parallel with US1
- **US3**: Can start after US1 (admin actions extend the catalog view)
- **US4**: Can start after US2 (admin actions extend the target view)
- **US5**: Can start after US1 and US2 (wizard consumes catalog and target data)

### Within Each User Story

- Integration tests before or alongside implementation for the affected journey
- Types/constants before service/hook work (Phase 1 order)
- Hooks before page components (pages consume hooks)
- List page before detail page (detail is navigated from list)
- Detail page before admin forms (admin forms extend the detail view)

### Parallel Opportunities

- T001 and T002 can run in parallel (different files)
- T005 and T006 can run in parallel (different files)
- US1 (Phase 3) and US2 (Phase 4) can run in parallel after Foundational
- T007 and T010 can run in parallel with their respective implementation tasks
- T013 and T017 can run in parallel (different test files)

---

## Parallel Example: User Story 1 + User Story 2

```bash
# After Foundational phase, launch both P1 stories in parallel:
# Developer A: US1 Template Catalog
Task: "T007 [US1] Add template catalog integration test coverage"
Task: "T008 [US1] Build TemplateListPage"
Task: "T009 [US1] Build TemplateDetailPage"

# Developer B: US2 Delivery Targets
Task: "T010 [US2] Add delivery-target list integration test coverage"
Task: "T011 [US2] Build DeliveryTargetListPage"
Task: "T012 [US2] Build DeliveryTargetDetailPage"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Template Catalog)
4. Stop and validate the template catalog browsing flow before moving on

### MVP+ (User Stories 1 + 2)

1. Complete Setup + Foundational
2. Deliver US1 (Template Catalog) and US2 (Delivery Targets) in parallel
3. Validate both browsing flows independently
4. Users can now discover templates and assess placement targets

### Incremental Delivery

1. Establish types, services, hooks, and routes (Phases 1-2)
2. Deliver US1 + US2 as the user-facing catalog and target views (Phase 3-4)
3. Add US3 + US4 for admin CRUD capabilities (Phase 5-6)
4. Add US5 for wizard integration consistency (Phase 7)
5. Finish with validation and browser testing (Phase 8)

---

## Notes

- [P] tasks touch different files and avoid incomplete dependency chains
- Every user story phase maps directly to the feature spec priorities
- Route-level integration coverage is required for admin mutation flows per constitution Principle IV
- Browser validation is required before considering the feature ready for merge
- The existing `EnvironmentCreateWizard` from spec 003 already supports template/delivery-target selection; US5 only needs to verify query-cache consistency
- T013 (Phase 5) extends `template-catalog.test.tsx` created by T007 (Phase 3); implementers should append admin-specific test cases rather than replacing the Phase 3 coverage
- T017 (Phase 6) extends `delivery-targets.test.tsx` created by T010 (Phase 4); same append-only pattern applies