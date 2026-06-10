# Feature Specification: Backend API UI Alignment

**Feature Branch**: `[003-backend-api-ui]`

**Created**: 2026-06-10

**Status**: Draft

**Input**: User description: "Udate UI based on this backend API changes"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create environments with backend-aligned inputs (Priority: P1)

Platform users can create a new environment through a UI flow that matches the backend's current requirements and validation rules, so they can complete provisioning without guessing fields or being blocked by avoidable request errors.

**Why this priority**: Environment creation is a core self-service workflow and is currently failing, which blocks the primary value of the portal.

**Independent Test**: A user completes the create-environment flow with valid input and reaches a successful environment detail view; invalid input or backend rejection is shown inline without losing entered values.

**Acceptance Scenarios**:

1. **Given** a user opens the create-environment flow, **When** they enter valid environment details that match the backend contract, **Then** the UI submits successfully and takes them to the created environment.
2. **Given** a user enters invalid or incomplete values, **When** validation runs before submission or the backend rejects the request, **Then** the UI explains what must be fixed and keeps the current draft intact.

---

### User Story 2 - Select placement and template context when required (Priority: P2)

Platform users can see and provide the placement and template-related information needed by the backend changes, so environment creation supports the newer platform workflows instead of only the older basic flow.

**Why this priority**: Backend Phase 3 expands environment creation to include template and delivery-target context, which the UI must expose to stay compatible with the current platform model.

**Independent Test**: A user can recognize when template or placement information is available, provide the needed values, and review them before submitting the form.

**Acceptance Scenarios**:

1. **Given** the environment flow includes placement or template-related options, **When** a user reaches the relevant step, **Then** the UI presents those options clearly and captures the selected values for review.
2. **Given** a user reviews the final draft, **When** the create-environment request includes placement or template context, **Then** the review step shows those values in human-readable form before submission.

---

### User Story 3 - Recover cleanly from backend mutation failures (Priority: P3)

Platform users can recover from create-environment errors caused by authorization, validation, or backend state conflicts, so failed requests do not force them to start over or guess next steps.

**Why this priority**: Backend contract changes introduce more validation and authorization paths, and the UI must turn those failures into a usable recovery flow.

**Independent Test**: A failed create-environment attempt shows an actionable message, preserves the entered draft, and allows the user to retry after correcting the issue.

**Acceptance Scenarios**:

1. **Given** the backend rejects a request because an input is invalid or unavailable, **When** submission fails, **Then** the user sees a clear error state tied to the failed action and can retry after making changes.
2. **Given** the backend rejects a request for permission or scope reasons, **When** submission fails, **Then** the UI communicates that access problem without clearing the form or showing a generic silent failure.

---

### Edge Cases

- What happens when placement or template-related fields are optional for some create-environment flows but not others?
- How does the system handle backend validation failures that are discovered only after form submission?
- What happens when selectable platform data is unavailable, empty, or temporarily inaccessible during environment creation?
- How does the flow behave when the user leaves and returns to the review step after fixing a failed submission?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST let authenticated users create a new environment through a guided workflow that reflects the backend's current environment-creation rules.
- **FR-002**: The system MUST present all user-provided environment fields in a form that reduces input ambiguity and helps users submit valid values on the first attempt.
- **FR-003**: The system MUST support environment creation journeys that include placement and template-related context when those values are part of the current backend-supported flow.
- **FR-004**: The system MUST show a review step that summarizes all submitted environment values in a clear, human-readable format before final submission.
- **FR-005**: The system MUST preserve user-entered create-environment data when submission fails and allow the user to retry after correction.
- **FR-006**: The system MUST surface backend validation, authorization, and conflict failures as actionable user-facing messages near the create-environment workflow.
- **FR-007**: The system MUST provide clear loading, empty, and error states for any create-environment data needed from the backend before submission can succeed.
- **FR-008**: The system MUST keep unsupported or unavailable platform options from appearing selectable in ways that lead users into guaranteed backend rejection.
- **FR-009**: Users MUST be able to understand whether a failed create-environment attempt can be fixed by changing form input, retrying later, or requesting additional access.

### Key Entities *(include if feature involves data)*

- **Environment Draft**: The in-progress environment definition entered by the user before submission, including identity, source, deployment, and optional platform context.
- **Template Context**: Reusable environment template information that may shape what values are needed during creation and review.
- **Delivery Target**: The placement choice that determines where a new environment is intended to run.
- **Submission Error**: A user-visible failure outcome from the create-environment action, including validation, authorization, availability, or conflict feedback.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete a valid create-environment flow without manual trial-and-error for required fields.
- **SC-002**: Users can identify and correct a failed create-environment submission in a single retry in the common validation-error case.
- **SC-003**: The review step enables users to confirm all submitted environment values before creation, reducing avoidable submission mistakes.
- **SC-004**: Failed create-environment attempts no longer force users to re-enter previously valid information.

## Assumptions

- The backend API contracts described in the linked `idp-core` backend documentation are the current source of truth for this feature.
- Existing authentication and route protection remain in place and are reused for the updated flow.
- The current environment creation journey remains a guided multi-step experience rather than being replaced with a different interaction model.
- Placement and template-related options are shown only when relevant data is available to the UI.
- This feature focuses on aligning the create-environment experience first; broader UI alignment for other backend changes can follow in later specs.
