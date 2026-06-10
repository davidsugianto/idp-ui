# Frontend-to-Backend Contract: Backend API UI Alignment

This document captures the frontend-facing integration expectations between `idp-ui` and the external `idp-core` backend for the create-environment alignment slice.

## 1. Related Backend Endpoints

### `POST /v1/environments`
Creates a new environment and now accepts optional template and delivery-target context in addition to the existing source metadata.

### `GET /v1/templates`
Provides visible templates the current caller can use as environment-creation context.

### `GET /v1/templates/{templateId}/versions`
Provides selectable versions for a chosen template.

### `GET /v1/delivery-targets`
Provides visible placement targets for environment creation.

## 2. Create-Environment Request Contract

The frontend must be able to submit a request shaped like:

```json
{
  "name": "payments-dev",
  "description": "Developer sandbox for payments",
  "git_repo_url": "https://github.com/example/app-config.git",
  "manifest_path": "environments/payments-dev",
  "git_revision": "main",
  "template_version_id": "tmpl-ver-123",
  "template_inputs": {
    "service_name": "payments-api"
  },
  "delivery_target_id": "target-dev-a"
}
```

## 3. Frontend-Visible Request Rules

- `name`, `git_repo_url`, `manifest_path`, and `git_revision` remain required user-provided values for the aligned flow.
- `template_version_id` is optional; the UI must still support flows where no template is selected.
- `template_inputs` is optional unless the selected template version defines required parameters.
- `delivery_target_id` is optional unless the backend-supported flow requires placement for the user’s chosen path.
- Optional fields not used by the current draft should be omitted from the final payload rather than sent as empty strings or empty objects.

## 4. Template Context Contract

For template-backed creation, the frontend needs enough information to:
- list visible templates
- show which versions are selectable
- understand which user inputs are required for the chosen version
- label those inputs in human-readable form
- review the selected template/version before final submission

At minimum, the frontend expects template/version data with:
- stable identifiers
- display names
- optional descriptions
- lifecycle or visibility state relevant to selection
- ordered parameter definitions containing `name`, `display_name`, `type`, `required`, and optional validation hints

## 5. Delivery-Target Contract

For placement-aware creation, the frontend needs delivery-target records containing:
- stable identifier
- machine-readable name
- human-readable display name
- purpose or environment classification when available
- availability state
- health state
- optional cluster/capacity context for review and selection

Frontend behavior depends on these backend rules:
- targets marked unavailable cannot be selected
- targets outside the caller’s scope should not appear as usable options
- selectable target metadata must be clear enough to review before submission

## 6. Success Contract

On success, the frontend expects the create call to return a created environment record with at least:
- stable environment identifier
- environment name
- lifecycle status
- standard environment detail fields used by the detail route
- resolved target/template metadata when the backend includes it

The returned identifier must be sufficient for immediate navigation to `/environments/:id`.

## 7. Failure Contract

The frontend needs backend failures to remain distinguishable so the UI can tell the user what to do next.

### Validation failure (`400`)
The response should provide enough detail to:
- explain what input is invalid or missing
- map field-specific problems back into the wizard when possible
- preserve the current draft for correction and retry

### Unauthorized (`401`)
The response should indicate the session is missing or invalid so the portal can route the user back through authentication.

### Forbidden (`403`)
The response should indicate the caller lacks permission to use the selected template, target, or create capability. The UI should preserve the draft and explain that additional access is required.

### Not found (`404`)
The response should indicate that a selected template version or delivery target is no longer valid in scope. The UI should preserve the draft and prompt the user to reselect current backend data.

### Conflict (`409`)
The response should indicate conflicts such as duplicate names or invalid state combinations so the user can correct the request or retry with a different option.

### Availability or transient operational failure (`5xx` or explicit unavailable semantics)
The response should allow the UI to tell the user the draft is still intact and whether retrying later is appropriate.

## 8. UX Implications the Contract Must Support

The contract must support the frontend in providing:
- inline validation messages for user-correctable problems
- non-selectable unavailable placement options
- explicit loading, empty, and fetch-error states for template and delivery-target data
- a review step that shows selected template and target values in human-readable form
- submit-error messaging that distinguishes fix-input vs retry-later vs request-access outcomes
- draft preservation after any recoverable submission failure
