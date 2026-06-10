# Research: IDP UI Phase 1 Core Portal

## Decision 1: Keep the SPA as a single React 18 + Vite frontend with feature-oriented page modules
- **Decision**: Implement Phase 1 within the existing single-project Vite application, organized by page modules and shared components rather than splitting into additional packages.
- **Rationale**: The repository already has a working SPA scaffold, route shell, auth layer, services, stores, and typed models. The feature spec also targets one frontend repository that consumes an external backend rather than a multi-package frontend platform. Keeping a single app avoids premature structure changes while still supporting modular page development.
- **Alternatives considered**:
  - Split into separate frontend packages for auth, dashboard, and environments — rejected because the current scope is small enough for one app and the extra package boundaries would add build and coordination overhead.
  - Rebuild the repo around a monorepo structure — rejected because the backend already lives in a separate repository and the feature only concerns the existing frontend app.

## Decision 2: Use the existing state split of React Query for server data and Zustand for client session/UI state
- **Decision**: Keep server-originated data in React Query hooks and keep session/UI state in Zustand stores.
- **Rationale**: This split is already documented in `CLAUDE.md` and matches the current codebase layout: API services and async flows exist under `src/services/`, while auth and UI state live in `src/stores/`. It also cleanly supports the feature spec requirements for protected access, retryable async views, and navigation state.
- **Alternatives considered**:
  - Move all state into Zustand — rejected because it would duplicate caching, refetching, and mutation state handling already provided by React Query.
  - Rely only on component-local state — rejected because auth, navigation, and shared resource data must persist across routes.

## Decision 3: Keep Axios service modules as the only backend integration boundary
- **Decision**: Continue using `src/services/` as the single integration layer for idp-core REST calls, with components and hooks consuming normalized service results.
- **Rationale**: The repository already enforces this pattern through `src/services/api.ts` and `src/services/environments.ts`, and `CLAUDE.md` explicitly says components should not call Axios directly. This keeps backend contract changes localized and aligns with the feature’s need to consume environment, auth, and admin endpoints from a separate repo.
- **Alternatives considered**:
  - Allow page components to call Axios directly — rejected because it would couple UI rendering to transport details and increase duplication.
  - Introduce a second data access abstraction on top of services — rejected because the current scope does not justify another indirection layer.

## Decision 4: Treat idp-core as an external dependency and document frontend-facing contracts rather than backend implementation details
- **Decision**: Define UI-facing contracts in the spec artifacts around the data shapes and actions the frontend depends on, while treating idp-core implementation as out of scope.
- **Rationale**: The feature spec explicitly limits scope to the `idp-ui` repository and treats backend behavior only insofar as it affects user-visible frontend behavior. Planning around interface expectations keeps the plan actionable without assuming control of the backend repository.
- **Alternatives considered**:
  - Include backend implementation tasks in the plan — rejected because they belong to `idp-core`, not this repository.
  - Omit contracts entirely — rejected because the frontend depends on stable auth and environment payloads from the backend.

## Decision 5: Validate Phase 1 primarily through route-level integration tests plus focused unit tests
- **Decision**: Use the existing Vitest + Testing Library setup for route-level integration coverage of auth, dashboard, environment browsing, creation, and admin access, supplemented by focused component and service tests.
- **Rationale**: The repository already contains integration tests for login and environment flows, plus unit tests for auth and API behavior. This matches the feature spec’s emphasis on user journeys and provides enough confidence for a UI-driven application without requiring a heavier end-to-end framework in the planning phase.
- **Alternatives considered**:
  - Add browser E2E tooling immediately — rejected because the current repo already has working test infrastructure and the plan can validate the primary flows without expanding the toolchain.
  - Rely only on unit tests — rejected because the feature’s highest-value behaviors span routing, auth guards, service integration, and page composition.

## Decision 6: Use graceful partial-data handling for dashboard and environment detail screens
- **Decision**: Plan for dashboard and environment detail pages to render partial content when supplemental datasets such as recommendations, costs, or workload details are unavailable.
- **Rationale**: The feature spec explicitly calls out edge cases where some data loads while other data fails. Designing for partial availability lets users continue core workflows such as navigation and environment inspection even when non-critical supporting data is degraded.
- **Alternatives considered**:
  - Fail the entire page on any missing dataset — rejected because it would violate the spec’s requirement for non-broken loading, empty, and error states.
  - Hide all errors and silently drop missing sections — rejected because users still need clear recovery and retry cues.
