# Frontend-to-Backend Contract: IDP UI Phase 1 Core Portal

This document defines the user-visible interface expectations that `idp-ui` depends on from `idp-core` for Phase 1. It describes the contract from the frontend’s perspective and intentionally avoids backend implementation details.

## 1. Authentication Contract

### Sign-in initiation
- The frontend must be able to start an authentication flow for a signed-out user.
- Successful sign-in must result in the frontend obtaining enough session information to render protected routes.
- Failed sign-in must return a user-displayable failure state without leaving the app in an ambiguous session state.

### Session refresh
- When the current session is no longer valid for an authenticated request, the frontend must have one retry path that can restore the session without forcing an immediate manual sign-in.
- If refresh fails, the frontend must treat the session as expired, clear protected state, and redirect the user to sign in again.

### Current user identity
- After authentication, the frontend must be able to obtain a current user record with:
  - stable user identifier
  - display name
  - email
  - authorization roles
  - group or team memberships when available

## 2. Environment Listing Contract

The frontend requires an environment listing response that can support:
- dashboard summary metrics
- recent environment navigation
- environment browser search/filter presentation

### Required environment fields
Each environment item must provide:
- unique environment identifier
- owning team reference
- display name
- namespace
- lifecycle status
- source repository reference
- source revision reference
- manifest location reference
- created timestamp
- updated timestamp

### Optional environment fields
When available, the frontend can additionally render:
- description
- cluster name or cluster target
- resource quota details
- labels or metadata tags
- owner reference
- expiration timestamp
- last synchronization timestamp
- recent error details and error count

## 3. Environment Detail and Workload Contract

### Environment detail
The frontend must be able to load one environment by identifier using the same canonical data shape as the listing response, with any additional metadata required for detail pages.

### Workload status
The frontend requires an environment workload response that includes:
- referenced environment identifier
- namespace
- summary counts for workloads and pods
- workload collection where each item includes:
  - name
  - type/kind
  - status
  - desired replica count
  - ready replica count
  - deployed image reference

If workload data is temporarily unavailable, the backend response or error must allow the frontend to present a recoverable error state while preserving the rest of the environment detail page.

## 4. Environment Mutation Contract

### Create environment
The frontend must be able to submit a new environment request with user-provided deployment inputs and receive either:
- the created environment record, or
- a validation/error response that can be mapped back to the form

### Synchronize environment
The frontend must be able to trigger a sync for a specific environment and receive a result that supports a user confirmation message plus a follow-up refresh of the environment state.

### Delete environment
If delete remains in Phase 1 scope, the frontend must be able to request deletion for a specific environment and receive a result that supports confirmation, refresh, or redirection away from the removed environment.

## 5. Dashboard Supplemental Data Contract

The frontend may enrich the landing page with supplemental backend datasets:
- cost summary information
- optimization or recommendation items
- alert indicators

These datasets are optional at the page level. If one is unavailable, the frontend must still be able to render the core landing page shell and any available environment summary information.

## 6. Admin Console Contract

For admin-only areas, the frontend requires backend responses for:
- user listing and management
- team listing and management
- role listing and management
- audit log listing

Each admin response must provide enough role or permission information for the frontend to:
- restrict access to authorized users only
- render management tables and detail actions
- refresh visible state after successful mutations

## 7. Error Contract

Across all contracts above, backend failures should return enough structured information for the frontend to distinguish between:
- unauthenticated session
- unauthorized access
- validation failure
- not found
- transient operational failure

The frontend depends on that distinction to decide whether to redirect, retry, annotate a form, or show a recoverable page-level error state.
