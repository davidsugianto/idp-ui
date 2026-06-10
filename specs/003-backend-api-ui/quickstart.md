# Quickstart: Validate Backend API UI Alignment

## Purpose

Use this guide to validate the create-environment UI after it is aligned to the current Phase 3 backend contract.

## Prerequisites

- Node.js 18+ and npm are installed.
- The `idp-core` backend is running locally.
- Authentication is configured for a developer user and, if needed for template visibility, an admin-capable user.
- The backend contains at least one selectable delivery target and, for template-backed validation, at least one template with a published version.
- Dependencies are installed with `npm install`.

## Setup

1. Start the backend prerequisites described in `../idp-core/specs/002-phase3-backend-foundation/quickstart.md`.
2. Confirm the frontend environment variables point at the intended local backend services.
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

## Validation Scenario 1: Happy-path environment creation without optional template context

1. Sign in as a user who can create environments.
2. Open `/environments/new`.
3. Confirm the create flow loads and any required backend-backed placement data resolves.
4. Enter valid base environment details.
5. If placement is part of the visible flow, choose an available delivery target.
6. Continue to the review step.
7. Confirm the review step shows the selected values in human-readable form.
8. Submit the request.
9. Confirm the app redirects to the created environment detail page.

**Expected outcome**: A valid non-template create request succeeds on the first attempt and navigates to the new environment without losing data.

## Validation Scenario 2: Template-backed environment creation

1. Open `/environments/new` with a user who can see template-backed creation options.
2. Select a template and a published version.
3. Confirm any required template-driven inputs appear.
4. Leave a required template input blank and attempt to continue or submit.
5. Confirm the UI explains what is missing.
6. Fill the required template inputs.
7. Review the final step and confirm the selected template/version and inputs are visible.
8. Submit the request.

**Expected outcome**: Template-backed flows collect the required template information and submit a payload aligned with the backend contract.

## Validation Scenario 3: Unavailable or empty placement/template data

1. Open `/environments/new` while template or delivery-target data is unavailable, empty, or returns an error.
2. Confirm the page shows a clear loading, empty, or recoverable error state near the affected section.
3. If targets are visible but unavailable, confirm those options are not selectable.
4. Retry the affected data load if the UI provides a retry action.

**Expected outcome**: Backend-backed choice data never fails silently, and unsupported or unavailable options cannot be chosen in ways that guarantee rejection.

## Validation Scenario 4: Backend validation failure with preserved draft

1. Open `/environments/new` and fill the form with values that will fail backend validation.
2. Submit the request.
3. Confirm the UI surfaces an actionable validation message.
4. Confirm the previously entered values remain intact.
5. Correct the invalid values.
6. Submit again.

**Expected outcome**: The common validation-error case can be corrected in-place without rebuilding the entire draft.

## Validation Scenario 5: Authorization or conflict failure

1. Submit a request using a template, target, or name that the backend will reject for permission or conflict reasons.
2. Confirm the error state explains whether the user needs different access, different input, or a retry later.
3. Confirm the draft is preserved.
4. Adjust the request if applicable and retry.

**Expected outcome**: Permission and conflict failures do not appear as silent or generic failures, and the form remains recoverable.

## Required Validation Commands

Run these commands before considering the feature ready:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Related Artifacts

- Feature specification: `specs/003-backend-api-ui/spec.md`
- Implementation plan: `specs/003-backend-api-ui/plan.md`
- Research decisions: `specs/003-backend-api-ui/research.md`
- Data model: `specs/003-backend-api-ui/data-model.md`
- Contract reference: `specs/003-backend-api-ui/contracts/create-environment-contract.md`
