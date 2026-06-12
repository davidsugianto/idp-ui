# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. Include the state-management split and backend integration boundary
  whenever this is a frontend or web application.
-->

**Language/Version**: [e.g., TypeScript 5.5, Python 3.11 or NEEDS CLARIFICATION]

**Primary Dependencies**: [e.g., React, FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]

**Storage**: [if applicable, e.g., browser session state, PostgreSQL, files or N/A]

**Testing**: [e.g., Vitest + Testing Library, pytest, XCTest or NEEDS CLARIFICATION]

**Target Platform**: [e.g., modern desktop/tablet browsers, Linux server, iOS 15+ or NEEDS CLARIFICATION]

**Project Type**: [e.g., frontend SPA, library, web-service, mobile-app or NEEDS CLARIFICATION]

**State Management**: [e.g., React Query for server state, Zustand for shared client state, local state for view-only concerns or N/A]

**Backend Integration Boundary**: [e.g., all backend calls stay in src/services/, external system contracts documented in contracts/ or N/A]

**Performance Goals**: [domain-specific, e.g., fast route access, 60 fps, 1000 req/s or NEEDS CLARIFICATION]

**Constraints**: [domain-specific, e.g., clear loading/empty/error states, <200ms p95, offline-capable or NEEDS CLARIFICATION]

**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **User-Journey Slicing**: Does the plan preserve independently testable user journeys in priority order?
- **Frontend Boundary Discipline**: Are service-layer boundaries and state-management choices explicit and consistent?
- **Contract Coverage**: Are external backend dependencies captured in contracts and reflected in validation guidance?
- **Verification Strategy**: Does the plan require lint, typecheck, test, build, and browser validation for affected journeys?
- **Template & Placement Governance**: If the feature involves environment creation, does the plan validate template version existence and delivery-target availability before submission?
- **UX Resilience**: Are loading, empty, error, and authorization states covered for user-visible flows?

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
