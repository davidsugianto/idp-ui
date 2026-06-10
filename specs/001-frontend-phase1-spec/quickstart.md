# Quickstart: Validate IDP UI Phase 1 Core Portal

## Purpose

This guide describes how to validate the Phase 1 frontend experience end to end after implementation work is complete.

## Prerequisites

- Node.js 18+ and npm installed.
- The `idp-core` backend is running and reachable from this frontend.
- Environment variables are configured for API, WebSocket, and OIDC endpoints.
- Project dependencies are installed with `npm install`.

## Setup

1. Configure the frontend environment variables required by the app.
2. Start the backend dependencies required for authentication and environment data.
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. In a second shell, keep validation commands available for later:
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   ```

## Validation Scenario 1: Authentication and protected routing

1. Open the application in a browser while signed out.
2. Attempt to navigate to a protected route.
3. Confirm the user is redirected into the sign-in flow.
4. Complete sign-in successfully.
5. Confirm the user lands on a protected portal page.
6. Refresh the browser.
7. Confirm the protected page remains accessible without a redirect loop.
8. Simulate an expired session.
9. Confirm the user is redirected back to sign in with a clear recovery path.

**Expected outcome**: Protected pages are inaccessible to signed-out users, accessible after sign-in, and safely revoked when the session expires.

## Validation Scenario 2: Dashboard visibility

1. Sign in as a standard developer.
2. Open the landing page.
3. Confirm environment summary indicators are visible.
4. Confirm recent environments can be opened from the landing page.
5. Simulate a partial dashboard failure, such as missing recommendations or cost data.
6. Confirm the rest of the dashboard still renders with a clear partial-data or retry state.

**Expected outcome**: The landing page provides quick awareness and navigation even when supplemental data is degraded.

## Validation Scenario 3: Environment browser and detail flow

1. Navigate to the environment browser.
2. Confirm the full environment list loads.
3. Apply search and filtering controls.
4. Confirm the visible results narrow appropriately.
5. Open one environment detail page.
6. Confirm metadata and workload sections appear.
7. Trigger an environment sync.
8. Confirm the action result is surfaced to the user and the environment state refreshes.

**Expected outcome**: Users can find, inspect, and operate on environments from the UI without leaving the portal.

## Validation Scenario 4: Environment creation flow

1. Navigate to the environment creation page.
2. Start the guided flow.
3. Attempt to continue with missing required inputs.
4. Confirm validation feedback appears at the correct step.
5. Submit a valid environment request.
6. Confirm the user lands on the created environment or an equivalent success destination.

**Expected outcome**: The creation flow blocks invalid submissions, accepts valid input, and transitions the user to the correct post-create state.

## Validation Scenario 5: Admin-only access

1. Sign in as a non-admin user and attempt to access admin pages.
2. Confirm access is blocked or redirected.
3. Sign in as an admin user.
4. Open user, team, role, and audit management screens.
5. Confirm management data loads and page-level actions are available only in the admin session.

**Expected outcome**: Admin pages are restricted to authorized users and remain unavailable to non-admin users.

## Validation Commands

Run the standard project checks before considering the feature ready:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Related Artifacts

- Feature specification: `specs/001-frontend-phase1-spec/spec.md`
- Implementation plan: `specs/001-frontend-phase1-spec/plan.md`
- Research decisions: `specs/001-frontend-phase1-spec/research.md`
- Data model: `specs/001-frontend-phase1-spec/data-model.md`
- Contract reference: `specs/001-frontend-phase1-spec/contracts/frontend-backend-contract.md`
