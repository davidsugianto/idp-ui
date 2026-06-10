# 📋 idp-ui — Development TODO List (Phase 1)

> **Phase**: 1 - Core Portal
> **Timeline**: Q4 2026 (~6 weeks)
> **Status**: 🔄 In Progress
> **Last Updated**: June 3, 2026
> **Backend**: [idp-core](https://github.com/davidsugianto/idp-core)
> **Backend TODO**: [idp-core Phase 3](https://github.com/davidsugianto/idp-core/blob/main/docs/DEV_TODO_LIST_PHASE_3.md)

---

## 📊 Progress Overview

| Milestone | Status | Progress |
|-----------|--------|----------|
| M1: Project Setup & Auth | ✅ Completed | 100% |
| M2: Dashboard & Environments | ⬜ Not Started | 0% |
| M3: Admin Console | ⬜ Not Started | 0% |
| M4: Settings & Polish | ⬜ Not Started | 0% |

---

## 🗓️ M1: Project Setup & Auth (Week 1-2)

> **Status**: ✅ Completed

### Project Scaffold

- [x] Initialize Vite + React + TypeScript project
- [x] Install dependencies: antd, react-router-dom, axios, react-query, zustand, react-hook-form, zod, dayjs
- [x] Install dev dependencies: vitest, @testing-library/react, eslint, prettier
- [x] Configure Vite (proxy to idp-core API, env variables)
- [x] Configure TypeScript (strict mode, path aliases)
- [x] Configure ESLint + Prettier
- [x] Docker + docker-compose setup (dev server on port 3089)
- [x] Makefile with common commands

### Ant Design Theme

- [x] Configure Ant Design theme tokens (primary color, border radius, font)
- [x] Set up global CSS reset and design tokens
- [x] Create responsive breakpoints configuration
- [x] Set up dark/light mode support

### Routing & Layout

- [x] Set up React Router with route definitions
- [x] Create `AppLayout` component (Header + Sidebar + Content)
- [x] Create `Header` component (Logo, Navigation, UserMenu)
- [x] Create `Sidebar` component (NavItem with icons)
- [x] Create `App` root component with RouterProvider

### API Client

- [x] Create Axios instance with base URL and interceptors
- [x] Add request interceptor (attach Bearer token)
- [x] Add response interceptor (handle 401 → refresh token)
- [x] Create API service modules: `auth.ts`, `environments.ts`, `admin.ts`
- [x] Set up React Query provider and configuration

### State Management

- [x] Create Zustand `authStore` (tokens, user, login/logout)
- [x] Create Zustand `uiStore` (sidebar collapsed, theme mode)
- [x] Implement token persistence (localStorage)

### Login & Auth

- [x] Create `LoginPage` with OIDC sign-in (redirect to `/api/auth/oidc/login`) + credential fallback
- [x] Create `CallbackPage` for OIDC callback (extract tokens from URL params)
- [x] Implement token refresh via OIDC (POST `/api/auth/oidc/refresh`)
- [x] Create `ProtectedRoute` component (redirect to login)
- [x] Create `AdminRoute` component (check admin role)
- [x] Implement logout via OIDC (POST `/api/auth/oidc/logout`, clear tokens, redirect)
- [x] Handle login loading and error states

### Auth Components

- [x] Create `AuthProvider` context wrapper
- [x] Create `useAuth` hook (isAuthenticated, user, login, logout)
- [x] Handle loading states during auth
- [x] Handle auth errors (bad credentials, session expired)
- [x] Store user profile in state (name, email, roles, groups)

### Auth Tests

- [x] Unit tests: AuthProvider
- [x] Unit tests: ProtectedRoute
- [x] Unit tests: authStore (Zustand)
- [x] Unit tests: API client interceptors
- [x] Integration tests: Login → Dashboard flow

---

## 🗓️ M2: Dashboard & Environments (Week 3-4)

> **Status**: ⬜ Not Started

### Dashboard

- [ ] Create `DashboardPage`
- [ ] Create `StatCard` component (env count, active, cost, alerts)
- [ ] Create `EnvironmentTable` component (recent environments)
- [ ] Create `RecommendationList` component (rightsizing)
- [ ] Wire up API calls with React Query (`useQuery`)
- [ ] Add loading skeletons (Ant Design Skeleton)
- [ ] Add error states with retry button

### Environment List

- [ ] Create `EnvironmentListPage`
- [ ] Create `FilterBar` component (team, cluster, status dropdowns)
- [ ] Create `EnvironmentCard` component (name, team, cluster, status, actions)
- [ ] Add search by environment name
- [ ] Implement pagination (Ant Design Pagination)
- [ ] Add sorting by name, status, date, cost

### Environment Detail

- [ ] Create `EnvironmentDetailPage`
- [ ] Create `EnvironmentInfo` component (namespace, team, cluster, git info)
- [ ] Create `WorkloadTable` component (name, type, status, CPU, memory)
- [ ] Add Tabs (Overview, Workloads, Logs, Settings)
- [ ] Add Sync button (trigger ArgoCD sync)
- [ ] Add Delete button with confirmation modal

### Environment Create Wizard

- [ ] Create `EnvironmentCreatePage`
- [ ] Create multi-step wizard (Ant Design Steps)
  - Step 1: Select template
  - Step 2: Configure parameters
  - Step 3: Review and confirm
- [ ] Add form validation (React Hook Form + Zod)
- [ ] Handle creation loading and success states
- [ ] Redirect to detail page on success

### Environment Tests

- [ ] Unit tests: EnvironmentCard
- [ ] Unit tests: FilterBar
- [ ] Unit tests: WorkloadTable
- [ ] Integration tests: Environment list → detail → sync flow
- [ ] Integration tests: Environment create wizard flow

---

## 🗓️ M3: Admin Console (Week 5)

> **Status**: ⬜ Not Started

### User Management

- [ ] Create `UserManagementPage`
- [ ] Create `UserTable` component (name, email, status, role, actions)
- [ ] Create user create/edit modal (Ant Design Modal + Form)
- [ ] Add search and pagination
- [ ] Add user status toggle (active/disabled)

### Team Management

- [ ] Create `TeamManagementPage`
- [ ] Create `TeamTable` component (name, member count, actions)
- [ ] Create team create/edit modal
- [ ] Create member management UI (add/remove/change role)
- [ ] Add search and pagination

### Role Management

- [ ] Create `RoleManagementPage`
- [ ] Create `RoleTable` component (name, permission count, system flag)
- [ ] Create role create/edit modal
- [ ] Create role assignment UI (assign user to role)
- [ ] Create role revoke UI

### Audit Logs

- [ ] Create `AuditLogPage`
- [ ] Create `AuditLogTable` component (timestamp, user, action, resource, status)
- [ ] Add filters (user, action, resource type, date range, status)
- [ ] Add pagination and sorting by timestamp

### Admin Tests

- [ ] Unit tests: UserTable
- [ ] Unit tests: TeamTable
- [ ] Integration tests: User CRUD flow
- [ ] Integration tests: Role assignment flow

---

## 🗓️ M4: Settings & Polish (Week 6)

> **Status**: ⬜ Not Started

### API Key Management

- [ ] Create `APIKeyPage`
- [ ] Create `APIKeyList` component (name, prefix, created, expires)
- [ ] Create API key creation flow (name → show key → copy warning)
- [ ] Implement key revocation with confirmation
- [ ] Show masked key after creation (one-time display)

### Settings

- [ ] Create `SettingsPage` with sections
- [ ] Add theme toggle (light/dark mode)
- [ ] Add notification preferences

### Polish

- [ ] Add loading skeleton states to all pages
- [ ] Add error boundaries at page level
- [ ] Add empty states for empty lists
- [ ] Add responsive layout for mobile/tablet
- [ ] Add keyboard shortcuts (Ctrl+K search)
- [ ] Add breadcrumbs navigation
- [ ] Add 404 page

### Final Checks

- [ ] Run linter: `npm run lint`
- [ ] Run tests: `npm run test`
- [ ] Run typecheck: `npm run typecheck`
- [ ] Build for production: `npm run build`
- [ ] Lighthouse audit (> 90 score)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

---

## 📊 Definition of Done

1. ✅ Component-based architecture with clean separation
2. ✅ Unit tests pass with > 80% coverage
3. ✅ Integration tests for critical flows
4. ✅ TypeScript compiles without errors
5. ✅ ESLint passes without errors
6. ✅ Lighthouse score > 90 for all pages
7. ✅ Responsive on desktop and tablet
8. ✅ PR reviewed and merged

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.23.0",
    "antd": "^5.20.0",
    "@ant-design/icons": "^5.4.0",
    "axios": "^1.7.0",
    "@tanstack/react-query": "^5.45.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.51.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.6.0",
    "dayjs": "^1.11.0",
    "recharts": "^2.12.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vite": "^5.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "vitest": "^1.6.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "eslint": "^8.57.0",
    "@typescript-eslint/parser": "^7.0.0",
    "prettier": "^3.3.0"
  }
}
```

---

## 🌐 Environment Variables

```bash
# .env
VITE_API_BASE_URL=http://localhost:8989
# OIDC variables kept for potential future use with Keycloak
# VITE_OIDC_ISSUER=http://localhost:8081/realms/idp-core
# VITE_OIDC_CLIENT_ID=idp-core
# VITE_OIDC_REDIRECT_URI=http://localhost:5173/auth/callback
```

---

## 📁 File Structure

```
idp-ui/
├── public/
├── src/
│   ├── components/
│   │   ├── common/                 # Button, Card, Modal, Table, etc.
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx       # → CREATED
│   │   │   ├── Header.tsx          # → CREATED
│   │   │   └── Sidebar.tsx         # → CREATED
│   │   ├── environments/
│   │   │   ├── EnvironmentCard.tsx  # → CREATED
│   │   │   ├── EnvironmentTable.tsx # → CREATED
│   │   │   ├── EnvironmentInfo.tsx  # → CREATED
│   │   │   └── WorkloadTable.tsx    # → CREATED
│   │   └── notifications/
│   │       └── NotificationCenter.tsx # → CREATED
│   │
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   └── DashboardPage.tsx    # → CREATED
│   │   ├── Environments/
│   │   │   ├── EnvironmentListPage.tsx    # → CREATED
│   │   │   ├── EnvironmentDetailPage.tsx  # → CREATED
│   │   │   └── EnvironmentCreatePage.tsx  # → CREATED
│   │   ├── Settings/
│   │   │   ├── SettingsPage.tsx           # → CREATED
│   │   │   └── APIKeyPage.tsx             # → CREATED
│   │   ├── Admin/
│   │   │   ├── UserManagementPage.tsx     # → CREATED
│   │   │   ├── TeamManagementPage.tsx     # → CREATED
│   │   │   ├── RoleManagementPage.tsx     # → CREATED
│   │   │   └── AuditLogPage.tsx           # → CREATED
│   │   └── Auth/
│   │       ├── LoginPage.tsx              # → CREATED
│   │       └── CallbackPage.tsx           # → CREATED
│   │
│   ├── hooks/
│   │   ├── useAuth.ts            # → CREATED
│   │   └── useEnvironments.ts    # → CREATED
│   │
│   ├── services/
│   │   ├── api.ts                # → CREATED
│   │   ├── auth.ts               # → CREATED
│   │   ├── environments.ts       # → CREATED
│   │   └── admin.ts              # → CREATED
│   │
│   ├── stores/
│   │   ├── authStore.ts          # → CREATED
│   │   └── uiStore.ts            # → CREATED
│   │
│   ├── types/
│   │   ├── environment.ts        # → CREATED
│   │   └── user.ts               # → CREATED
│   │
│   ├── App.tsx                    # → CREATED
│   └── main.tsx                   # → CREATED
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📎 References

- [PRD Overview](./prd/PRD.md)
- [PRD Phase 1](./prd/PRD_PHASE_1.md)
- [idp-core](https://github.com/davidsugianto/idp-core)
- [idp-core Phase 3 TODO](https://github.com/davidsugianto/idp-core/blob/main/docs/DEV_TODO_LIST_PHASE_3.md)
- [Ant Design](https://ant.design/)
- [React Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

## 📝 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1.0 | May 21, 2026 | Platform Engineering | Initial Phase 1 TODO list |