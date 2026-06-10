# Research: IDP UI Phase 1 Core Portal

## Decision 1: Keep Phase 1 as a single React/Vite SPA with page-module organization
- **Decision**: Implement the Phase 1 portal within the existing single-project frontend application rather than introducing additional packages or splitting the repository structure.
- **Rationale**: The repository already contains the core SPA shell, route structure, auth provider, services, stores, and page modules. The Phase 1 PRD describes one frontend portal consuming a separate backend, so the simplest matching design is to extend the current app structure under `src/`.
- **Alternatives considered**:
  - Split the frontend into multiple packages by domain — rejected because Phase 1 scope is small enough for one SPA and package boundaries would add coordination overhead.
  - Restructure into a monorepo with backend code — rejected because `idp-core` intentionally remains a separate repository and external dependency.

## Decision 2: Preserve the documented state split of React Query for server state and Zustand for shared client state
- **Decision**: Use React Query for API-backed resource loading and mutations, use Zustand for shared auth/session and UI shell state, and keep ephemeral view state local to the component tree.
- **Rationale**: The repo guidance in `CLAUDE.md` and the constitution both require this split. It matches the needs of the feature set: auth/session persistence, cached environment lists and details, optimistic or refresh-driven mutations, and shared navigation state.
- **Alternatives considered**:
  - Put all state in Zustand — rejected because it would reimplement async caching and invalidation behavior better handled by React Query.
  - Use only local component state — rejected because auth, routing, and shared datasets span multiple pages.

## Decision 3: Keep all backend integration behind the service layer and document contracts from the frontend perspective
- **Decision**: Route all backend communication through `src/services/` and document the frontend-facing auth, environment, admin, and API-key contracts in the feature artifacts.
- **Rationale**: The project constitution requires frontend boundary discipline and contract-driven integration. This keeps backend transport details out of components and localizes future API drift to service and contract artifacts.
- **Alternatives considered**:
  - Call Axios directly from pages and components — rejected because it breaks the service boundary and spreads backend assumptions across the UI.
  - Omit contract documentation because the backend exists already — rejected because the frontend is a separate repo and needs explicit integration expectations.

## Decision 4: Validate Phase 1 primarily with route-level integration tests plus focused component/service tests
- **Decision**: Use the existing Vitest + Testing Library stack for route-level user-journey coverage, especially around auth, protected routes, environment flows, and admin access, with supporting unit tests for components, stores, and services.
- **Rationale**: The highest-risk regressions in this portal occur at the seams between routing, auth state, and backend data. Route-level integration coverage directly matches the feature spec’s independently testable user stories and the constitution’s verification requirements.
- **Alternatives considered**:
  - Add a new browser E2E framework immediately — rejected because the current repo already has suitable test infrastructure for planning and early implementation.
  - Rely only on unit tests — rejected because they would not adequately cover protected navigation or page composition flows.

## Decision 5: Design for partial-data resilience on dashboard, environment, and admin screens
- **Decision**: Treat loading, empty, error, unauthorized, and partial-data states as first-class design requirements for all user-facing pages in scope.
- **Rationale**: The spec and constitution both require non-broken user-visible behavior under degraded conditions. Several explicit edge cases in the Phase 1 spec involve partial availability of costs, recommendations, workloads, and admin data.
- **Alternatives considered**:
  - Fail whole pages when any secondary dataset is unavailable — rejected because it would block core workflows and violate the resilience requirement.
  - Silently suppress missing sections — rejected because users need clear recovery or retry cues.

## Decision 6: Keep Phase 1 scope bounded to portal foundation, environments, admin, settings, and API key management
- **Decision**: Exclude Phase 2 and Phase 3 roadmap features such as templates, broader cost exploration, real-time status, accessibility expansion, and internationalization from the implementation plan unless the spec is amended.
- **Rationale**: The Phase 1 PRD and the current feature spec explicitly bound the work to the core portal. Strong scope control keeps the implementation aligned with adoption-oriented Phase 1 outcomes.
- **Alternatives considered**:
  - Pull selected Phase 2 features into the plan now — rejected because it would blur delivery milestones and increase implementation risk.
