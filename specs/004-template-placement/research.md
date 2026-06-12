# Research: Template Management & Multi-Cluster Placement

## 1. Template Catalog UI Pattern

**Decision**: Use Ant Design `Table` with category filters and detail drawer, matching the existing environment list pattern in the codebase.

**Rationale**: The project already uses Ant Design `Table` for environment and admin list pages. A consistent table-based catalog with expandable detail views (or a side drawer) maintains UX cohesion and reuses existing `AsyncState`, `FilterBar`, and table wrapper patterns.

**Alternatives considered**:
- Card grid layout for templates — better for visual browsing but inconsistent with the rest of the admin portal and harder to scale with many templates.
- `ProTable` from `@ant-design/pro-components` — adds a dependency and diverges from the current plain `Table` convention; deferred per the Ant Design Pro refactor plan.

## 2. Template Version & Parameter Editing

**Decision**: Render template version parameters as a dynamic form section using React Hook Form with Zod validation, matching the parameter types (string, number, boolean) defined by the backend contract.

**Rationale**: The existing create-environment wizard already demonstrates RHF + Zod for template parameter inputs. Extending this pattern to the admin template version editor keeps the form behavior predictable and testable.

**Alternatives considered**:
- Custom form builder — over-engineered for the parameter types supported (string, number, boolean).
- JSON editor for parameters — simpler to implement but poor UX for non-technical administrators.

## 3. Delivery Target Status Visualization

**Decision**: Use Ant Design `Tag` and `Badge` components for availability and health state, with a dedicated status column in the target list table.

**Rationale**: `Tag`/`Badge` status indicators are already used for environment status throughout the app. Color-coded availability (green = available, orange = degraded, red = unavailable) provides at-a-glance recognition.

**Alternatives considered**:
- Custom status icons — adds visual polish but increases maintenance burden without functional benefit.
- Plain text status — fails the SC-002 success criterion of "at a glance" identification.

## 4. Admin Route Protection

**Decision**: Reuse the existing `AdminRoute` wrapper component and admin role check pattern for template and delivery-target management pages.

**Rationale**: The codebase already has `AdminRoute` gating admin pages. Template/target management is explicitly admin-only per the spec. No new auth pattern is needed.

**Alternatives considered**:
- Inline permission checks — scattered and harder to audit than the centralized route guard.
- Separate role for "template admin" — adds complexity without a clear product requirement.

## 5. Integration with Existing Create-Environment Wizard

**Decision**: Extend the existing `EnvironmentCreateWizard` template and delivery-target selection to consume the same React Query cache keys used by the standalone catalog/target pages.

**Rationale**: React Query's cache sharing means fresh data loaded on the catalog page is immediately available in the wizard dropdowns without refetching. The wizard already supports template and delivery-target selection from spec 003.

**Alternatives considered**:
- Separate query instances per page — would cause duplicate network requests and stale data divergence.
- Lifting template/target state to Zustand — adds unnecessary global state when React Query already handles server-state caching.

## 6. Page Module Structure

**Decision**: Add `src/pages/Templates/` and `src/pages/DeliveryTargets/` with list and detail/admin pages, following the existing `src/pages/` module convention.

**Rationale**: The constitution requires page-level features under `src/pages/`. Templates and delivery targets are distinct domain concepts that warrant their own page modules, matching the pattern of `src/pages/Environments/`, `src/pages/Admin/`, etc.

**Alternatives considered**:
- Grouping both under a single "Platform" module — would couple two independently testable user stories.
- Admin-only pages under `src/pages/Admin/` — hides user-facing catalog and target views behind admin routes.