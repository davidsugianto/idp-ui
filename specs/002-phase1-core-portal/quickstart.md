# Quickstart: Validate IDP UI Phase 1 Core Portal

## Purpose

Use this guide to validate the Phase 1 frontend portal end to end after implementation work is complete.

## Prerequisites

- Node.js 18+ and npm are installed.
- The `idp-core` backend is running and reachable from the frontend.
- Authentication and API environment variables are configured for local development.
- Dependencies are installed with `npm install`.

## Setup

1. Confirm the frontend environment variables point to the intended backend services.
2. Start any required backend dependencies for auth, environment data, admin data, and API key flows.
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Keep the validation commands ready in a second shell:
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   ```

## Validation Scenario 1: Authentication and protected routing

1. Open the app while signed out.
2. Attempt to access a protected route.
3. Confirm the user is directed into the sign-in flow.
4. Complete sign-in successfully.
5. Confirm a protected page renders.
6. Refresh the browser.
7. Confirm the user remains signed in.
8. Simulate an expired or invalid session.
9. Confirm the portal redirects back to sign in with a clear recovery path.
10. Sign out and confirm protected pages are no longer accessible.

**Expected outcome**: Protected navigation is enforced for signed-out users, preserved during valid sessions, and safely revoked on expiry or logout.

## Validation Scenario 2: Dashboard and environment browsing

1. Sign in as a developer with visible environments.
2. Open the dashboard.
3. Confirm environment counts and recent environments are visible.
4. Open a recent environment from the landing page.
5. Navigate to the environment browser.
6. Apply search and filter controls.
7. Confirm the visible list narrows to matching environments.
8. Open an environment detail page.
9. Confirm metadata and workload sections render.
10. Trigger a synchronization action.
11. Confirm the action result is surfaced and relevant data refreshes.

**Expected outcome**: Developers can discover, inspect, and manage environments through the portal without leaving the UI.

## Validation Scenario 3: Partial-data resilience

1. Load the dashboard with cost or recommendation data unavailable.
2. Confirm the dashboard shell and core environment summary still render.
3. Load an environment detail page with workload data unavailable.
4. Confirm the environment detail metadata still renders and the workload section shows a recoverable failure state.
5. Load an admin page with backend data unavailable.
6. Confirm the page shows a non-broken error or empty state.

**Expected outcome**: User-visible pages remain understandable and navigable when secondary datasets fail.

## Validation Scenario 4: Environment creation

1. Navigate to the create-environment flow.
2. Attempt to continue with missing or invalid required inputs.
3. Confirm the portal highlights the corrections needed before submission.
4. Submit a valid creation request.
5. Confirm the portal transitions to the expected success destination.
6. Leave the flow before submission and confirm the app remains stable.

**Expected outcome**: The creation flow blocks invalid submissions, accepts valid input, and ends in a clear success state.

## Validation Scenario 5: Admin-only access

1. Sign in as a non-admin user and attempt to open admin routes.
2. Confirm access is blocked or redirected.
3. Sign in as an authorized administrator.
4. Open user, team, role, and audit screens.
5. Confirm management data loads and admin actions are available.

**Expected outcome**: Admin capabilities remain restricted to authorized users while still being usable for administrators.

## Validation Scenario 6: Settings and API key management

1. Sign in as a standard user.
2. Open settings and navigate to API key management.
3. Confirm existing keys load with masked display.
4. Create a new key and confirm the one-time key display behavior works if provided.
5. Revoke an existing key and confirm the visible state refreshes.

**Expected outcome**: Users can manage API keys from settings without exposing long-lived secrets incorrectly.

## Required Validation Commands

Run these commands before considering the feature ready:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Related Artifacts

- Feature specification: `specs/002-phase1-core-portal/spec.md`
- Implementation plan: `specs/002-phase1-core-portal/plan.md`
- Research decisions: `specs/002-phase1-core-portal/research.md`
- Data model: `specs/002-phase1-core-portal/data-model.md`
- Contract reference: `specs/002-phase1-core-portal/contracts/frontend-backend-contract.md`
