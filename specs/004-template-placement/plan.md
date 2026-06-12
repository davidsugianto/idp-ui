# Implementation Plan: Template Management & Multi-Cluster Placement

**Branch**: `004-template-placement` | **Date**: 2026-06-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-template-placement/spec.md`

## Summary

Add standalone template catalog and delivery-target browsing pages, admin CRUD interfaces for templates (with version/parameter management) and delivery targets, and integrate the new catalog data with the existing environment creation wizard. The feature builds on the backend API contracts documented in `idp-core` for templates, template versions, parameters, resources, and delivery targets.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: React 18+, Vite 5+, Ant Design 5+, React Query (TanStack Query), Zustand, React Router 6+, React Hook Form + Zod, Axios, Vitest + Testing Library

**Storage**: N/A (frontend only; backend persistence via idp-core API)

**Testing**: Vitest + Testing Library; route-level integration tests in `src/__tests__/integration/`

**Target Platform**: Modern desktop/tablet browsers

**Project Type**: Frontend SPA

**State Management**: React Query for template/delivery-target server state, Zustand for auth/UI state, local state for form/view concerns

**Backend Integration Boundary**: All API calls in `src/services/` with snake_case→camelCase normalization; consumed via React Query hooks in `src/hooks/`

**Performance Goals**: Template catalog and target list load within 3 seconds on standard connection

**Constraints**: Loading/empty/error/unauthorized states for all views; admin-only gating for write operations; consistent with Ant Design Pro refactor direction

**Scale/Scope**: 2 new page modules (Templates, DeliveryTargets), admin CRUD forms, integration hooks with existing wizard

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **User-Journey Slicing**: PASS — 5 user stories ordered by priority (P1 catalog browsing → P1 target viewing → P2 admin template CRUD → P2 admin target CRUD → P3 wizard integration). Each independently testable.
- **Frontend Boundary Discipline**: PASS — All data through `src/services/environments.ts` and React Query hooks in `src/hooks/useEnvironments.ts`. Components never call Axios directly.
- **Contract Coverage**: PASS — Template and delivery-target API contracts fully documented in `contracts/template-api.md` and `contracts/delivery-target-api.md`, including request/response shapes, error states, and UI states.
- **Verification Strategy**: PASS — Requires lint, typecheck, test, build, and browser validation. Integration tests for catalog browsing, admin CRUD, and wizard integration.
- **Template & Placement Governance**: PASS — This feature directly implements the constitution Principle VI. Template version existence and delivery-target availability are validated in both standalone views and the wizard. Unavailable targets are visibly disabled.
- **UX Resilience**: PASS — Every view has loading, empty, error, and unauthorized states documented. Admin routes are gated. Mutation errors surface inline field errors and preserve form input.

## Project Structure

### Documentation (this feature)

```text
specs/004-template-placement/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── template-api.md
│   └── delivery-target-api.md
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── pages/
│   ├── Templates/
│   │   ├── TemplateListPage.tsx        # Catalog browsing (US1)
│   │   ├── TemplateDetailPage.tsx      # Version/parameter view (US1)
│   │   ├── TemplateCreatePage.tsx      # Admin: create template (US3)
│   │   └── TemplateVersionCreatePage.tsx # Admin: publish version (US3)
│   └── DeliveryTargets/
│       ├── DeliveryTargetListPage.tsx  # Target browsing (US2)
│       ├── DeliveryTargetDetailPage.tsx # Target detail (US2)
│       └── DeliveryTargetCreatePage.tsx # Admin: register target (US4)
├── components/
│   └── templates/
│       └── TemplateTable.tsx           # Shared template list table (T006)
├── services/
│   └── environments.ts                 # Extended with template/target API calls
├── hooks/
│   └── useEnvironments.ts             # Extended with template/target query hooks
├── types/
│   └── environment.ts                  # Extended with Template, TemplateVersion,
│                                       # TemplateParameter, DeliveryTarget types
└── __tests__/
    └── integration/
        ├── template-catalog.test.tsx    # US1 integration tests
        ├── delivery-targets.test.tsx    # US2 integration tests
        └── environment-flow.test.tsx   # Extended: US5 wizard integration
```

**Structure Decision**: Single-project frontend SPA following the existing `src/pages/` module convention. Templates and DeliveryTargets are separate page modules matching the independently testable user story structure. The existing `src/services/environments.ts` and `src/hooks/useEnvironments.ts` are extended rather than split, since templates and delivery targets are part of the environment domain.

## Complexity Tracking

> No violations to justify. All constitution checks pass.