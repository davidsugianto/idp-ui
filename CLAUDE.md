# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

IDP UI is the React frontend for the idp-core backend API. It provides a developer self-service portal for environment management, deployment, and monitoring.

**Current state**: Pre-implementation. PRDs and task breakdowns live in `docs/`. No source code exists yet.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint
npm run test       # Run tests
npm run typecheck  # TypeScript type checking
```

## Tech Stack

- **React 18+** with functional components and hooks
- **Vite 5+** for build tooling
- **Ant Design 5+** component library
- **Zustand** for global state, **React Query** (TanStack Query) for server state and API calls
- **React Router 6+** for routing
- **React Hook Form + Zod** for form state and validation
- **Recharts** for charts
- **Axios** for HTTP, **WebSocket** for real-time updates
- **OIDC** authentication against the idp-core backend

## Architecture

The SPA communicates with idp-core via REST API (CRUD), WebSocket (real-time updates), and OIDC (auth).

**Page modules** each have their own directory under `src/pages/`: Dashboard, Environments, Templates, Costs, Workloads, Settings, Admin. See README.md for the full route table.

**State management split**:
- Server/async state → React Query (API caching, refetching)
- Global client state → Zustand stores in `src/stores/`
- Local component state → React `useState`/`useReducer`

**API layer**: Service functions in `src/services/` encapsulate Axios calls. Components should not call Axios directly.

## Environment Variables

```
VITE_API_BASE_URL=http://localhost:8989
VITE_WS_BASE_URL=ws://localhost:8989/ws
VITE_OIDC_ISSUER=http://localhost:8081/realms/idp-core
VITE_OIDC_CLIENT_ID=idp-core
```

## Related Repos

- [idp-core](https://github.com/davidsugianto/idp-core) — backend API (must be running for local development)
- PRD: `docs/prd/PRD_PHASE_1.md`
- Task list: `docs/DEV_TODO_LIST_PHASE_1.md`

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read `specs/003-backend-api-ui/plan.md`.
<!-- SPECKIT END -->
