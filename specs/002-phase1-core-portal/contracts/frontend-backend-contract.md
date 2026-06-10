# Frontend-to-Backend Contract: IDP UI Phase 1 Core Portal

This document captures the frontend-facing integration expectations between `idp-ui` and the external `idp-core` backend for Phase 1.

## 1. Authentication Contract

### Required capabilities
- Start a sign-in flow for a signed-out portal user.
- Return enough session information for the frontend to render protected routes after a successful sign-in.
- Support a refresh path for expired or nearly expired sessions.
- Return the current authenticated user profile.
- End the session on logout.

### Frontend-visible expectations
The frontend needs a current-user shape that includes:
- stable user identifier
- display name
- email
- authorization roles
- group or team memberships when available

Authentication failures must distinguish between:
- unauthenticated session
- unauthorized access
- recoverable validation or credential problems
- transient backend failure

## 2. Dashboard Contract

The frontend must be able to load a landing-page dataset containing:
- environment summary counts
- recent environments for quick navigation
- optional alert indicators
- optional cost summary information
- optional recommendation items

If optional supplemental datasets fail, the backend response or error semantics must still allow the frontend to render a usable dashboard shell and show a clear partial-data state.

## 3. Environment Listing and Detail Contract

### Environment listing
The frontend requires an environment collection where each environment item provides:
- unique identifier
- owning team reference
- display name
- namespace
- lifecycle status
- source repository reference
- source revision reference
- manifest location reference
- created timestamp
- updated timestamp

Optional fields that the frontend can render when present include:
- description
- cluster target
- resource quota details
- labels
- owner reference
- expiration timestamp
- last synchronization timestamp
- recent error details and count

### Environment detail
The frontend must be able to load one environment by identifier with the same canonical data shape used by listings, plus any additional fields needed for detail presentation.

### Workload status
For environment detail pages, the frontend needs:
- referenced environment identifier
- namespace
- workload and pod summary counts
- workload rows containing name, kind, status, desired replicas, ready replicas, and image reference

If workload data fails independently, the frontend must still be able to present the rest of the environment detail page along with a recoverable error state for the workload section.

## 4. Environment Mutation Contract

### Create environment
The frontend must be able to submit a new environment request and receive either:
- the created environment record, or
- a validation failure that can be mapped back to user-correctable form fields

### Synchronize environment
The frontend must be able to trigger a synchronization request for an environment and receive a result that supports user confirmation plus a refresh of relevant environment state.

### Delete environment
If deletion remains enabled in Phase 1 scope, the frontend must be able to request removal of an environment and receive a result that supports confirmation, refresh, or safe redirection.

## 5. Admin Contract

For admin-only screens, the frontend needs responses for:
- user listing and management
- team listing and management
- role listing and management
- audit-log listing

Each admin response must provide enough authorization and record data for the frontend to:
- block access for non-admin users
- render management views for authorized users
- refresh visible state after successful mutations

## 6. Settings and API Key Contract

The frontend must be able to load and manage API key records for the signed-in user, including:
- list existing keys
- create a new key
- revoke an existing key

The contract should support one-time display behavior for newly created secrets if the backend returns that value, while preserving masked display for subsequent list views.

## 7. Error Contract

Across all Phase 1 endpoints, the backend should return enough structured failure information for the frontend to distinguish between:
- unauthenticated access
- unauthorized access
- validation failure
- missing resource
- transient operational failure

The frontend depends on this distinction to decide whether to redirect, retry, annotate a form, or show a recoverable page-level error state.
