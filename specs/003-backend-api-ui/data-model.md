# Data Model: Backend API UI Alignment

## Environment Draft
- **Purpose**: Represents the in-progress create-environment form state that the user edits across wizard steps before submission.
- **Fields**:
  - `name`: required environment identifier.
  - `description`: optional environment summary.
  - `gitRepoUrl`: required GitOps repository URL.
  - `manifestPath`: required manifest location.
  - `gitRevision`: required source revision.
  - `templateVersionId`: optional selected template version identifier.
  - `templateInputs`: optional key-value inputs required by the selected template version.
  - `deliveryTargetId`: optional selected backend placement target.
  - `resourceQuotaCpu`, `resourceQuotaMemory`: optional quota values if still supported in the aligned flow.
  - `expiresAt`: optional ISO datetime string.
- **Relationships**:
  - May reference one template version.
  - May reference one delivery target.
  - Produces one create-environment request.
- **Validation rules**:
  - Required identity and source fields must be present before the user can review or submit.
  - `templateInputs` are required only when the selected template version defines required parameters.
  - `deliveryTargetId` is required only when the backend-supported flow requires placement.
  - Draft values must remain intact after recoverable submit failures.
- **State transitions**:
  - `editing` → `reviewing` when step validation passes.
  - `reviewing` → `submitting` on final submit.
  - `submitting` → `created` on success.
  - `submitting` → `editing_with_errors` on validation, authorization, conflict, or availability failure.

## Template Context
- **Purpose**: Represents the reusable template and version metadata that changes what the user must provide during environment creation.
- **Fields**:
  - `templateId`: parent template identifier.
  - `templateName`: human-readable template name.
  - `versionId`: selected template version identifier.
  - `versionLabel`: display version label.
  - `description`: optional template or version summary.
  - `parameters`: ordered parameter definitions for user input.
  - `visibility`: scope metadata that affects who can use the template.
  - `status`: lifecycle state relevant to selection.
- **Relationships**:
  - One template can expose many versions.
  - One version can define many template input fields.
  - A selected version may shape one environment draft.
- **Validation rules**:
  - Only backend-visible and usable template versions may be selectable.
  - Parameter definitions drive which template inputs are required and how they are labeled.

## Template Input Field
- **Purpose**: Represents one backend-defined input the user must fill for a selected template version.
- **Fields**:
  - `name`: machine-readable request key.
  - `displayName`: user-facing label.
  - `type`: backend-declared value type.
  - `required`: whether the field must be filled before submission.
  - `validation`: optional backend-provided validation hints such as a pattern.
  - `defaultValue`: optional suggested initial value.
- **Relationships**:
  - Belongs to one template version.
  - Maps to one entry inside `Environment Draft.templateInputs`.
- **Validation rules**:
  - Required template inputs must block progression or submission when missing.
  - User-entered values must be serializable into the backend `template_inputs` object.

## Delivery Target
- **Purpose**: Represents a backend-owned placement option for the new environment.
- **Fields**:
  - `id`: unique target identifier.
  - `name`: machine-readable target name.
  - `displayName`: human-readable target label.
  - `purpose`: optional usage context such as dev or staging.
  - `availabilityState`: whether the target is available for placement.
  - `healthState`: health signal shown in the UI.
  - `clusterName`: backend cluster label.
  - `clusterServer`: optional cluster endpoint reference.
  - `capacitySummary`: optional capacity metadata used for context.
- **Relationships**:
  - May be selected by many environment drafts over time.
  - One environment draft references at most one delivery target.
- **Validation rules**:
  - Unavailable or disallowed targets must not be selectable.
  - Visible target metadata must remain human-readable in the review step.

## Create Environment Request
- **Purpose**: Represents the frontend payload sent to `POST /v1/environments`.
- **Fields**:
  - `name`
  - `description`
  - `git_repo_url`
  - `manifest_path`
  - `git_revision`
  - `template_version_id` when a template is selected
  - `template_inputs` when template parameters are supplied
  - `delivery_target_id` when placement is selected
  - `resource_quota_cpu`, `resource_quota_memory`, and `expires_at` only when the aligned contract still accepts them
- **Relationships**:
  - Produced from one environment draft.
  - Returns one created environment on success.
- **Validation rules**:
  - Omit optional fields that are not selected or relevant.
  - When `template_version_id` is present, the payload must include template inputs consistent with the selected version.
  - When `delivery_target_id` is present, it must reference a selectable visible target.

## Submission Error
- **Purpose**: Represents a backend rejection that the UI must convert into actionable recovery guidance.
- **Fields**:
  - `kind`: validation, unauthorized, forbidden, not_found, conflict, unavailable, or unknown.
  - `message`: primary user-facing summary.
  - `fieldErrors`: optional field-to-message mapping for inline annotation.
  - `retryable`: whether the user should retry later without changing inputs.
  - `accessRelated`: whether the user likely needs additional permissions.
- **Relationships**:
  - Can be attached to one failed create-environment submission.
  - May annotate multiple fields in the environment draft.
- **Validation rules**:
  - Validation failures should map to editable fields where possible.
  - Authorization and access failures should not be presented as generic validation problems.
  - Errors must not clear the existing draft.

## Created Environment Summary
- **Purpose**: Represents the success payload the UI uses immediately after creation for redirect and confirmation.
- **Fields**:
  - `id`: created environment identifier.
  - `name`: created environment name.
  - `status`: initial lifecycle status.
  - `deliveryTarget`: resolved target summary when placement was selected.
  - `templateVersion`: resolved template version summary when a template was selected.
- **Relationships**:
  - Returned from one successful create request.
  - Drives redirect into the environment detail route.
- **Validation rules**:
  - Must include a stable identifier for navigation.
  - Review and success expectations should stay consistent with submitted values.
