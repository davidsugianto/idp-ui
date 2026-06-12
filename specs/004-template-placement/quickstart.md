# Quickstart: Template Management & Multi-Cluster Placement

## Prerequisites

- The idp-core backend is running and seeded with at least one template and delivery target
- The idp-ui dev server is running (`npm run dev`)
- A platform admin token is available for admin-only flows

## Validation Scenarios

### 1. Browse Template Catalog

1. Navigate to `/templates`
2. **Expected**: Template list renders with name, category, and latest version columns
3. **Expected**: Each template row is clickable to view details
4. **Expected**: Empty state renders when no templates exist

### 2. View Template Detail & Versions

1. Click a template from the catalog list
2. **Expected**: Template detail shows description, author, visibility, and version history
3. **Expected**: Each version shows stability flag (stable/latest markers), parameters, and resources
4. **Expected**: Parameter definitions show name, type, default value, and required flag

### 3. View Delivery Targets

1. Navigate to `/delivery-targets`
2. **Expected**: Target list renders with display name, purpose, cluster, availability, and health columns
3. **Expected**: Available/healthy targets show green status indicators
4. **Expected**: Unavailable or degraded targets show amber/red status indicators
5. **Expected**: Empty state renders when no targets are registered

### 4. Admin: Create Template

1. As an admin, navigate to `/admin/templates/new`
2. Fill in name, description, category, and visibility
3. Submit the form
4. **Expected**: Redirect to the new template's detail page or the template list
5. **Expected**: 400 validation errors display inline; 409 conflict shows name-uniqueness error

### 5. Admin: Publish Template Version with Parameters

1. As an admin, navigate to an existing template's detail page
2. Click "Publish version"
3. Enter version number, description, and stability flags
4. Add parameters: name, display name, type, default value, required flag
5. Submit
6. **Expected**: New version appears in the version history list

### 6. Admin: Register Delivery Target

1. As an admin, navigate to `/admin/delivery-targets/new`
2. Fill in name, display name, purpose, cluster name, cluster server, availability, health
3. Submit
4. **Expected**: Target appears in the delivery targets list
5. **Expected**: 400 validation errors display inline

### 7. Integration: Template & Target in Environment Creation

1. Browse the template catalog and note available templates
2. Navigate to `/environments/new`
3. Complete the Basics and Source steps
4. In the Deployment step, open the template dropdown
5. **Expected**: Same templates from the catalog appear in the dropdown
6. Select a template version and verify parameter inputs match the template detail view
7. Open the delivery target dropdown
8. **Expected**: Available targets are selectable; unavailable targets are disabled with reason shown

### 8. Error & Recovery States

1. Stop the idp-core backend
2. Navigate to `/templates`
3. **Expected**: Error state with retry button is displayed
4. Restart the backend and click retry
5. **Expected**: Template catalog loads successfully
6. Repeat for `/delivery-targets`

### 9. Authorization States

1. Log in as a non-admin user
2. Attempt to navigate to `/admin/templates/new`
3. **Expected**: 403 unauthorized page or redirect
4. **Expected**: Admin-only actions (create, edit, delete buttons) are not visible in the template and target list views
5. **Expected**: Non-admin users can still browse templates and targets

## Run Commands

```bash
npm run lint        # ESLint validation
npm run typecheck   # TypeScript type checking
npm run test        # Run test suite (integration tests for templates and targets)
npm run build       # Production build
```

## Success Checks

- Template catalog loads and filters correctly
- Template detail shows complete version/parameter/resource data
- Delivery targets render with accurate availability/health indicators
- Admin CRUD operations succeed with valid input and fail gracefully with invalid input
- Environment creation wizard template/target selections match standalone views
- All loading, empty, error, and unauthorized states render without breaking