# Tasks: IDP UI Phase 1 Core Portal

**Input**: Design documents from `/specs/002-phase1-core-portal/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Include the relevant test and validation tasks required by the feature spec and constitution. For UI work, include lint, typecheck, test, build, and browser validation tasks; add route-level integration tests for auth, protected routing, admin gating, or data mutations when those flows are affected.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. `[US1]`, `[US2]`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align the existing frontend shell and shared utilities with the active Phase 1 plan.

- [X] T001 Align the Phase 1 route and navigation map in `src/App.tsx` and `src/components/layout/Sidebar.tsx`
- [X] T002 [P] Add shared endpoint and query-key constants in `src/constants/api.ts`
- [X] T003 [P] Create reusable async and unauthorized screen-state components in `src/components/common/AsyncState.tsx` and `src/components/common/UnauthorizedState.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Complete the shared auth, shell, and service foundations that all user stories rely on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Implement auth session hydration and redirect orchestration in `src/components/auth/AuthProvider.tsx`, `src/components/auth/ProtectedRoute.tsx`, and `src/components/auth/AdminRoute.tsx`
- [X] T005 [P] Complete OIDC sign-in, refresh, and logout service flows in `src/services/auth.ts` and `src/services/oidc.ts`
- [X] T006 [P] Normalize authenticated user and token state handling in `src/types/user.ts` and `src/stores/authStore.ts`
- [X] T007 [P] Add shared admin and API key service clients in `src/services/admin.ts` and `src/services/apiKeys.ts`
- [X] T008 Update the protected application shell and primary navigation behavior in `src/components/layout/AppLayout.tsx`, `src/components/layout/Header.tsx`, and `src/components/layout/Sidebar.tsx`

**Checkpoint**: Foundation ready — user story implementation can now proceed.

---

## Phase 3: User Story 1 - Access the core portal (Priority: P1) 🎯 MVP

**Goal**: Deliver reliable sign-in, session persistence, logout, and protected-route behavior for the portal.

**Independent Test**: Sign in as a valid user, land on a protected page, refresh the browser, simulate an expired session, and confirm redirect back to sign in.

### Tests for User Story 1

- [ ] T009 [P] [US1] Expand auth journey integration coverage in `src/__tests__/integration/login-flow.test.tsx`
- [ ] T010 [P] [US1] Add protected-route unit coverage in `src/components/auth/__tests__/ProtectedRoute.test.tsx` and `src/components/auth/__tests__/AdminRoute.test.tsx`

### Implementation for User Story 1

- [X] T011 [US1] Implement login submission, loading, and error handling in `src/pages/Auth/LoginPage.tsx`
- [X] T012 [US1] Implement callback exchange and session restoration in `src/pages/Auth/CallbackPage.tsx`
- [X] T013 [US1] Wire logout and session-expiry UX in `src/components/layout/Header.tsx` and `src/hooks/useAuth.ts`
- [X] T014 [US1] Finalize protected-route redirect behavior in `src/App.tsx` and `src/components/auth/ProtectedRoute.tsx`

**Checkpoint**: User Story 1 should now be independently functional and testable.

---

## Phase 4: User Story 2 - Monitor and manage environments (Priority: P1)

**Goal**: Deliver dashboard visibility, environment browsing, detail inspection, and synchronization actions.

**Independent Test**: Sign in as a developer, open the dashboard, browse and filter environments, open an environment detail page, and trigger a sync action.

### Tests for User Story 2

- [ ] T015 [P] [US2] Expand dashboard and environment journey coverage in `src/__tests__/integration/environment-flow.test.tsx`
- [ ] T016 [P] [US2] Add dashboard component coverage in `src/components/dashboard/__tests__/StatCard.test.tsx` and `src/components/dashboard/__tests__/RecommendationList.test.tsx`
- [ ] T017 [P] [US2] Add environment component coverage in `src/components/environments/__tests__/FilterBar.test.tsx` and `src/components/environments/__tests__/WorkloadTable.test.tsx`

### Implementation for User Story 2

- [X] T018 [US2] Implement dashboard query composition in `src/services/dashboard.ts` and `src/hooks/useDashboard.ts`
- [X] T019 [US2] Build dashboard summary UI in `src/pages/Dashboard/DashboardPage.tsx`, `src/components/dashboard/StatCard.tsx`, `src/components/dashboard/EnvironmentTable.tsx`, and `src/components/dashboard/RecommendationList.tsx`
- [X] T020 [US2] Implement environment browser filtering and list actions in `src/pages/Environments/EnvironmentListPage.tsx`, `src/components/environments/FilterBar.tsx`, and `src/components/environments/EnvironmentCard.tsx`
- [X] T021 [US2] Implement environment detail metadata and workload sections in `src/pages/Environments/EnvironmentDetailPage.tsx`, `src/components/environments/EnvironmentInfo.tsx`, and `src/components/environments/WorkloadTable.tsx`
- [X] T022 [US2] Extend environment list, detail, sync, and delete mutations in `src/services/environments.ts` and `src/hooks/useEnvironments.ts`
- [X] T023 [US2] Apply loading, empty, and partial-data states across dashboard and environment screens in `src/pages/Dashboard/DashboardPage.tsx`, `src/pages/Environments/EnvironmentListPage.tsx`, and `src/pages/Environments/EnvironmentDetailPage.tsx`

**Checkpoint**: User Story 2 should now be independently functional and testable.

---

## Phase 5: User Story 3 - Create environments through the UI (Priority: P2)

**Goal**: Deliver a guided environment-creation flow with validation, submission, and success handling.

**Independent Test**: Sign in as a developer, complete the create-environment flow with valid input, submit it, and confirm the portal reaches the intended success destination.

### Tests for User Story 3

- [ ] T024 [P] [US3] Add create-environment journey coverage in `src/__tests__/integration/environment-create-flow.test.tsx`
- [ ] T025 [P] [US3] Add create-flow validation coverage in `src/components/environments/__tests__/EnvironmentCreateWizard.test.tsx`

### Implementation for User Story 3

- [X] T026 [US3] Implement the multi-step creation wizard in `src/components/environments/EnvironmentCreateWizard.tsx` and `src/pages/Environments/EnvironmentCreatePage.tsx`
- [X] T027 [US3] Add create-environment request modeling and validation in `src/types/environment.ts` and `src/components/environments/EnvironmentCreateWizard.tsx`
- [X] T028 [US3] Wire create-environment mutation and success navigation in `src/services/environments.ts`, `src/hooks/useEnvironments.ts`, and `src/pages/Environments/EnvironmentCreatePage.tsx`
- [X] T029 [US3] Add abandoned-flow and submission-error handling in `src/pages/Environments/EnvironmentCreatePage.tsx` and `src/components/common/AsyncState.tsx`

**Checkpoint**: User Story 3 should now be independently functional and testable.

---

## Phase 6: User Story 4 - Perform platform administration (Priority: P3)

**Goal**: Deliver admin-only access control plus user, team, role, and audit management screens for authorized administrators.

**Independent Test**: Sign in as an admin to confirm admin screens load, then sign in as a non-admin and confirm those routes are blocked or redirected.

### Tests for User Story 4

- [ ] T030 [P] [US4] Add admin access integration coverage in `src/__tests__/integration/admin-access.test.tsx`
- [ ] T031 [P] [US4] Add admin table component coverage in `src/components/admin/__tests__/UserTable.test.tsx` and `src/components/admin/__tests__/AuditLogTable.test.tsx`

### Implementation for User Story 4

- [X] T032 [US4] Define admin record models and service adapters in `src/types/admin.ts` and `src/services/admin.ts`
- [X] T033 [US4] Implement admin route wiring and landing-page access in `src/App.tsx`, `src/components/auth/AdminRoute.tsx`, and `src/pages/Admin/AdminDashboardPage.tsx`
- [X] T034 [US4] Implement user, team, role, and audit management screens in `src/pages/Admin/UserManagementPage.tsx`, `src/pages/Admin/TeamManagementPage.tsx`, `src/pages/Admin/RoleManagementPage.tsx`, `src/pages/Admin/AuditLogPage.tsx`, `src/components/admin/UserTable.tsx`, `src/components/admin/TeamTable.tsx`, `src/components/admin/RoleTable.tsx`, and `src/components/admin/AuditLogTable.tsx`

**Checkpoint**: User Story 4 should now be independently functional and testable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Finish remaining Phase 1 scope and run the full validation pass.

- [X] T035 [P] Add API key management integration coverage in `src/__tests__/integration/api-key-flow.test.tsx`
- [X] T036 Implement settings and API key management UI in `src/pages/Settings/SettingsPage.tsx`, `src/pages/Settings/APIKeyPage.tsx`, `src/components/settings/APIKeyList.tsx`, and `src/components/settings/APIKeyCreateModal.tsx`
- [X] T037 Implement API key models and service mutations in `src/types/apiKey.ts` and `src/services/apiKeys.ts`
- [X] T038 Apply responsive, unauthorized, and shared screen-state polish across `src/components/layout/AppLayout.tsx`, `src/pages/Dashboard/DashboardPage.tsx`, `src/pages/Environments/EnvironmentListPage.tsx`, `src/pages/Admin/UserManagementPage.tsx`, and `src/pages/Settings/SettingsPage.tsx`
- [ ] T039 Run the validation commands and browser scenarios documented in `specs/002-phase1-core-portal/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup** — can start immediately.
- **Phase 2: Foundational** — depends on Phase 1 and blocks all user stories.
- **Phase 3: US1** — depends on Phase 2.
- **Phase 4: US2** — depends on Phase 2; can proceed independently once auth and shell foundations are complete.
- **Phase 5: US3** — depends on Phase 2 and shares environment domain work from Phase 4.
- **Phase 6: US4** — depends on Phase 2; can proceed independently of US2 and US3 once admin services and route guards are in place.
- **Phase 7: Polish** — depends on the desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: No user-story dependency after foundational auth work is ready.
- **US2 (P1)**: No user-story dependency after foundational auth and shell work is ready.
- **US3 (P2)**: Builds on the shared environment domain and mutation layer introduced for US2.
- **US4 (P3)**: No user-story dependency after foundational auth and shell work is ready.

### Within Each User Story

- Write or update tests first, then confirm they fail where applicable.
- Implement types and service adapters before page integration.
- Complete route wiring and UI states before calling the story done.
- Validate each story independently before moving to the next priority slice.

---

## Parallel Opportunities

### User Story 1

```bash
# Parallelize auth coverage updates
Task: "T009 Expand auth journey integration coverage in src/__tests__/integration/login-flow.test.tsx"
Task: "T010 Add protected-route unit coverage in src/components/auth/__tests__/ProtectedRoute.test.tsx and src/components/auth/__tests__/AdminRoute.test.tsx"
```

### User Story 2

```bash
# Parallelize dashboard and environment component coverage
Task: "T016 Add dashboard component coverage in src/components/dashboard/__tests__/StatCard.test.tsx and src/components/dashboard/__tests__/RecommendationList.test.tsx"
Task: "T017 Add environment component coverage in src/components/environments/__tests__/FilterBar.test.tsx and src/components/environments/__tests__/WorkloadTable.test.tsx"

# Parallelize service and page implementation after contracts are understood
Task: "T018 Implement dashboard query composition in src/services/dashboard.ts and src/hooks/useDashboard.ts"
Task: "T020 Implement environment browser filtering and list actions in src/pages/Environments/EnvironmentListPage.tsx, src/components/environments/FilterBar.tsx, and src/components/environments/EnvironmentCard.tsx"
```

### User Story 3

```bash
# Parallelize create-flow coverage
Task: "T024 Add create-environment journey coverage in src/__tests__/integration/environment-create-flow.test.tsx"
Task: "T025 Add create-flow validation coverage in src/components/environments/__tests__/EnvironmentCreateWizard.test.tsx"
```

### User Story 4

```bash
# Parallelize admin coverage work
Task: "T030 Add admin access integration coverage in src/__tests__/integration/admin-access.test.tsx"
Task: "T031 Add admin table component coverage in src/components/admin/__tests__/UserTable.test.tsx and src/components/admin/__tests__/AuditLogTable.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Validate the authentication journey independently with `src/__tests__/integration/login-flow.test.tsx` and the quickstart auth scenario.
5. Demo or ship the protected portal entry point.

### Incremental Delivery

1. Complete Setup + Foundational to stabilize the shell, auth, and service boundaries.
2. Deliver US1 for authenticated access.
3. Deliver US2 for dashboard visibility and environment operations.
4. Deliver US3 for create-environment self-service.
5. Deliver US4 for admin access.
6. Finish Phase 7 for settings, API keys, polish, and full validation.

### Parallel Team Strategy

With multiple developers after foundational work completes:

1. Developer A: US1 auth UX hardening and validation.
2. Developer B: US2 dashboard and environment browsing.
3. Developer C: US4 admin services and management screens.
4. Fold US3 and Phase 7 tasks in once the shared environment and settings layers are available.

---

## Notes

- All tasks use the required checklist format: checkbox, task ID, optional `[P]`, required `[US#]` for story tasks, and exact file paths.
- User-story tasks are organized to keep each journey independently implementable and testable.
- Browser validation is required in addition to automated checks for affected UI work.
- Phase 2 and Phase 3 roadmap features remain intentionally excluded from this task list.
