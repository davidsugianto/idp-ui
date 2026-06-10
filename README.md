# IDP UI - Developer Portal

[![GitHub](https://img.shields.io/badge/GitHub-davidsugianto%2Fidp--ui-blue)](https://github.com/davidsugianto/idp-ui)

A modern web application for the Internal Developer Platform (IDP) that provides developers with a self-service interface for environment management, deployment, and monitoring.

**Repository**: https://github.com/davidsugianto/idp-ui

## Overview

IDP UI is the frontend for [idp-core](../idp-core), currently providing:

- **Dashboard** - Overview of environments, alerts, and recommendations
- **Environment Management** - Browse, inspect, sync, and create environments
- **Settings** - Manage personal settings and API keys
- **Admin Console** - Manage users, teams, roles, and audit logs

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | React | 18+ |
| Build Tool | Vite | 5+ |
| UI Library | Ant Design | 5+ |
| State | Zustand + React Query | Latest |
| Router | React Router | 6+ |
| Forms | React Hook Form + Zod | Latest |
| Charts | Recharts | Latest |
| API Client | Axios | Latest |
| Real-time | WebSocket | - |

## Project Structure

```
idp-ui/
├── public/                 # Static assets
├── src/
│   ├── __tests__/          # Route-level integration tests
│   ├── components/
│   │   ├── admin/          # Admin tables and views
│   │   ├── auth/           # Auth providers and route guards
│   │   ├── common/         # Shared async/unauthorized UI states
│   │   ├── dashboard/      # Dashboard widgets
│   │   ├── environments/   # Environment cards, filters, workloads, wizard
│   │   ├── layout/         # App shell components
│   │   ├── notifications/  # Notification helpers
│   │   └── settings/       # API key management UI
│   ├── constants/          # API paths and query keys
│   ├── hooks/              # React Query hooks and auth helpers
│   ├── pages/
│   │   ├── Admin/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Environments/
│   │   └── Settings/
│   ├── services/           # API service functions
│   ├── stores/             # Zustand stores
│   ├── test/               # Test setup
│   ├── theme/              # Ant Design theme config
│   ├── types/              # TypeScript domain models
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Root routes
│   └── main.tsx            # Entry point
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Overview with environment metrics and recommendations |
| `/auth/login` | Login | Sign-in entry point |
| `/auth/callback` | Callback | OIDC callback handling |
| `/environments` | EnvironmentList | Browse, filter, and sync environments |
| `/environments/:id` | EnvironmentDetail | Environment details and workload status |
| `/environments/new` | EnvironmentCreate | Guided create-environment wizard |
| `/settings` | Settings | User preferences and settings landing page |
| `/settings/api-keys` | APIKeys | Create, review, and revoke API keys |
| `/admin` | AdminConsole | Admin dashboard |
| `/admin/users` | UserManagement | Manage users |
| `/admin/teams` | TeamManagement | Manage teams |
| `/admin/roles` | RoleManagement | Manage roles |
| `/admin/audit-logs` | AuditLogs | Review audit activity |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+ or yarn 1.22+
- idp-core API running

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Validate code quality
npm run lint
npm run typecheck
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:8989
VITE_WS_BASE_URL=ws://localhost:8989/ws
VITE_OIDC_ISSUER=http://localhost:8081/realms/idp-core
VITE_OIDC_CLIENT_ID=idp-core
```

## Development

### Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run test      # Run tests
npm run typecheck # Run TypeScript check
```

### Code Style

- Use TypeScript for all new files
- Follow ESLint configuration
- Use functional components with hooks
- Keep backend calls inside `src/services/`
- Use React Query for server data and async caching
- Use Zustand for shared client session and UI state
- Use React Hook Form + Zod for form validation
- Provide loading, empty, error, and unauthorized states for user-facing screens
- Validate changes with `npm run lint`, `npm run typecheck`, and `npm run build` before review
- Add or update route-level integration coverage when protected routes or data mutations change

## API Integration

The UI communicates with idp-core API through:

- **REST API** - CRUD operations for dashboard, environments, admin resources, and API keys
- **OIDC** - Authentication, token refresh, and logout
- **WebSocket** - Planned for real-time updates

### Key API Areas

- Authentication: `/auth/oidc/*`, `/auth/me`
- Dashboard: `/v1/dashboard`
- Environments: `/v1/environments`, `/v1/environments/:id`, `/v1/environments/:id/workloads`, `/v1/environments/:id/sync`
- Admin: `/v1/users`, `/v1/teams`, `/v1/roles`, `/v1/audit-logs`
- Settings: `/v1/api-keys`

See [idp-core API documentation](../idp-core/docs/swagger) for full API reference.

## Contributing

1. Create a feature branch
2. Make changes
3. Run tests and lint
4. Submit PR

## License

MIT

## Related

- [idp-core](https://github.com/davidsugianto/idp-core) - Backend API
- [PRD Phase 1](./docs/prd/PRD_PHASE_1.md) - Product requirements
- [Development TODO](./docs/DEV_TODO_LIST_PHASE_1.md) - Task list
