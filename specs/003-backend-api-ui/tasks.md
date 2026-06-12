# Tasks: Backend API UI Alignment

**Input**: Design documents from `/specs/003-backend-api-ui/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include route-level integration coverage for the create-environment mutation flow in `src/__tests__/integration/environment-flow.test.tsx`, then finish with lint, typecheck, test, build, and browser validation for the updated UI.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single-project frontend app rooted at `src/`
- Route-level integration coverage in `src/__tests__/integration/`
- Backend communication only through `src/services/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the shared constants and domain model needed by the backend-aligned create-environment flow.

- [x] T001 Extend backend endpoint and query-key constants for template and delivery-target data in `src/constants/api.ts`
- [x] T002 Expand backend-aligned environment request, option, and error types in `src/types/environment.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the service and page plumbing that all user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Implement template, template-version, and delivery-target fetchers plus aligned create payload serialization in `src/services/environments.ts`
- [x] T004 Implement React Query hooks and query-key helpers for template, template-version, and delivery-target loading in `src/hooks/useEnvironments.ts`
- [x] T005 Update create-environment form defaults and page-level async plumbing for the aligned draft shape in `src/pages/Environments/EnvironmentCreatePage.tsx`
- [x] T006 Add integration-test mock scaffolding for template, version, delivery-target, and create-error scenarios in `src/__tests__/integration/environment-flow.test.tsx`

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 - Create environments with backend-aligned inputs (Priority: P1) 🎯 MVP

**Goal**: Let users complete the guided create-environment flow with base fields that match the current backend contract.

**Independent Test**: A user completes `/environments/new` with valid base input, reaches the review step, submits successfully, and sees invalid input or submit failure without losing entered values.

### Implementation for User Story 1

- [x] T007 [P] [US1] Add happy-path and base validation integration coverage for `/environments/new` in `src/__tests__/integration/environment-flow.test.tsx`
- [x] T008 [US1] Replace legacy cluster-focused wizard inputs with backend-aligned identity and source-step inputs in `src/components/environments/EnvironmentCreateWizard.tsx`
- [x] T009 [US1] Align the deployment/review flow with the base backend request fields in `src/components/environments/EnvironmentCreateWizard.tsx`
- [x] T010 [US1] Wire aligned submit success and base submit-error rendering in `src/pages/Environments/EnvironmentCreatePage.tsx` and `src/components/environments/EnvironmentCreateWizard.tsx`

**Checkpoint**: User Story 1 should support the aligned non-template create flow and remain independently testable.

---

## Phase 4: User Story 2 - Select placement and template context when required (Priority: P2)

**Goal**: Expose template and delivery-target context when the backend-supported flow requires it and show those selections clearly before submit.

**Independent Test**: A user can load visible template and delivery-target data, choose supported options, provide any required template inputs, and confirm those selections in the review step.

### Implementation for User Story 2

- [x] T011 [P] [US2] Add template-selection, template-input, and delivery-target integration coverage in `src/__tests__/integration/environment-flow.test.tsx`
- [x] T012 [US2] Render template, template-version, and template-input controls with conditional validation in `src/components/environments/EnvironmentCreateWizard.tsx`
- [x] T013 [US2] Render delivery-target selection with visible unavailable-state handling in `src/components/environments/EnvironmentCreateWizard.tsx`
- [x] T014 [US2] Connect template, version, and delivery-target query state plus retry actions in `src/pages/Environments/EnvironmentCreatePage.tsx` and `src/hooks/useEnvironments.ts`
- [x] T015 [US2] Show template and placement selections in the review step in `src/components/environments/EnvironmentCreateWizard.tsx`

**Checkpoint**: User Story 2 should make template and placement context usable without breaking the independently testable US1 flow.

---

## Phase 5: User Story 3 - Recover cleanly from backend mutation failures (Priority: P3)

**Goal**: Turn backend validation, authorization, conflict, and availability failures into clear recovery paths while preserving the draft.

**Independent Test**: A failed create attempt shows actionable guidance, keeps all prior input intact, and allows correction or retry without rebuilding the draft.

### Implementation for User Story 3

- [x] T016 [P] [US3] Add route-level coverage for `400`, `401`, `403`, `409`, and backend-backed option load failures in `src/__tests__/integration/environment-flow.test.tsx`
- [x] T017 [US3] Implement structured create-environment error parsing and field-error extraction in `src/services/environments.ts`
- [x] T018 [US3] Surface inline field errors and recovery guidance without clearing the form in `src/pages/Environments/EnvironmentCreatePage.tsx` and `src/components/environments/EnvironmentCreateWizard.tsx`
- [x] T019 [US3] Add loading, empty, error, unauthorized, and retry states for template and delivery-target data in `src/components/environments/EnvironmentCreateWizard.tsx`
- [x] T020 [US3] Preserve and revalidate the draft when users return from failed review or submit attempts in `src/components/environments/EnvironmentCreateWizard.tsx` and `src/pages/Environments/EnvironmentCreatePage.tsx`

**Checkpoint**: All three user stories should now be independently functional and recoverable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup across all user stories.

- [x] T021 Validate shared type, service, hook, and test consistency across `src/types/environment.ts`, `src/services/environments.ts`, `src/hooks/useEnvironments.ts`, and `src/__tests__/integration/environment-flow.test.tsx`
- [x] T022 Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` using `package.json` for the changes touching `src/pages/Environments/EnvironmentCreatePage.tsx` and `src/components/environments/EnvironmentCreateWizard.tsx`
- [x] T023 Manually verify happy-path, template/placement, unauthorized-state, and failure-recovery browser flows for `src/pages/Environments/EnvironmentCreatePage.tsx` and `src/components/environments/EnvironmentCreateWizard.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion — MVP slice
- **User Story 2 (Phase 4)**: Depends on Foundational completion and should build on the stable US1 create flow
- **User Story 3 (Phase 5)**: Depends on Foundational completion and should validate error handling across US1 and US2 paths
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1**: Can start immediately after Phase 2
- **US2**: Can start after Phase 2, but should be integrated on top of the aligned US1 base flow
- **US3**: Can start after Phase 2 once the base create flow and async option loading surfaces exist

### Within Each User Story

- Integration coverage should be written before or alongside implementation for the affected journey
- Types/constants before service serialization and query hooks
- Query/service plumbing before wizard UI wiring
- Wizard UI before review-step and recovery refinements
- Complete each story’s checkpoint before moving to the next priority when working sequentially

### Parallel Opportunities

- T001 and T002 can run in parallel after the feature branch is ready
- T003 and T006 can run in parallel once Phase 1 is complete
- T007 can run in parallel with T008 because it targets the integration test file while T008 targets the wizard UI
- T011 can run in parallel with T012/T013 for the same reason
- T016 can run in parallel with T017 because test coverage and service-layer error parsing touch different files

---

## Parallel Example: User Story 2

```bash
# Launch route coverage and UI work for placement/template support together:
Task: "T011 [US2] Add template-selection, template-input, and delivery-target integration coverage in src/__tests__/integration/environment-flow.test.tsx"
Task: "T012 [US2] Render template, template-version, and template-input controls with conditional validation in src/components/environments/EnvironmentCreateWizard.tsx"
Task: "T013 [US2] Render delivery-target selection with visible unavailable-state handling in src/components/environments/EnvironmentCreateWizard.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate the aligned base create-environment flow before moving on

### Incremental Delivery

1. Establish aligned types, services, hooks, and page plumbing
2. Deliver US1 as the non-template backend-aligned create flow
3. Add US2 for template and delivery-target context
4. Add US3 for recovery and degraded-state handling
5. Finish with required automated and browser validation

### Parallel Team Strategy

1. One developer handles Phase 1–2 service/query plumbing
2. A second developer can prepare integration coverage in `src/__tests__/integration/environment-flow.test.tsx`
3. After the foundation is stable, wizard UI and error-recovery work can proceed in parallel across different files

---

## Notes

- [P] tasks touch different files and avoid incomplete dependency chains
- Every user story phase maps directly to the feature spec priorities
- Route-level integration coverage is required because this feature changes an environment mutation flow
- Browser validation is required before considering the feature ready for merge
