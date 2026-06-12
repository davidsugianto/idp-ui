import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/theme/ThemeProvider';
import App from '@/App';
import { useAuthStore } from '@/stores/authStore';

const mockListEnvironments = vi.fn();
const mockGetEnvironment = vi.fn();
const mockGetEnvironmentWorkloads = vi.fn();
const mockSyncEnvironment = vi.fn();
const mockCreateEnvironment = vi.fn();
const mockDeleteEnvironment = vi.fn();
const mockGetDashboardSummary = vi.fn();
const mockListTemplates = vi.fn();
const mockListTemplateVersions = vi.fn();
const mockListDeliveryTargets = vi.fn();

vi.mock('@/services/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/auth')>();

  return {
    ...actual,
    loginWithCredentials: vi.fn(),
    refreshToken: vi.fn().mockResolvedValue({
      auth_token: 'test-token',
      expires_in: 300,
      user_id: 'user-1',
      email: 'admin@example.com',
      is_admin: true,
    }),
    logoutUser: vi.fn(),
    probeAuthenticatedSession: vi.fn(),
    fetchCurrentUser: vi.fn().mockResolvedValue({
      id: 'user-1',
      name: 'Platform Admin',
      email: 'admin@example.com',
      roles: ['admin'],
      groups: [],
    }),
    fetchUserById: vi.fn().mockResolvedValue({
      id: 'user-1',
      name: 'Platform Admin',
      email: 'admin@example.com',
      roles: ['admin'],
      groups: [],
    }),
    startOidcLogin: vi.fn(),
  };
});

vi.mock('@/services/environments', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/environments')>();
  return {
    ...actual,
    listEnvironments: (...args: unknown[]) => mockListEnvironments(...args),
    getEnvironment: (...args: unknown[]) => mockGetEnvironment(...args),
    getEnvironmentWorkloads: (...args: unknown[]) => mockGetEnvironmentWorkloads(...args),
    syncEnvironment: (...args: unknown[]) => mockSyncEnvironment(...args),
    createEnvironment: (...args: unknown[]) => mockCreateEnvironment(...args),
    deleteEnvironment: (...args: unknown[]) => mockDeleteEnvironment(...args),
    listTemplates: (...args: unknown[]) => mockListTemplates(...args),
    listTemplateVersions: (...args: unknown[]) => mockListTemplateVersions(...args),
    listDeliveryTargets: (...args: unknown[]) => mockListDeliveryTargets(...args),
  };
});

vi.mock('@/services/dashboard', () => ({
  getDashboardSummary: (...args: unknown[]) => mockGetDashboardSummary(...args),
}));

function renderApp(initialEntry: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe('Environment flow', () => {
  beforeEach(() => {
    mockListEnvironments.mockResolvedValue([
      {
        id: 'env-1',
        teamId: 'team-1',
        name: 'payments-dev',
        description: 'Development environment',
        namespace: 'idp-team-1-payments-dev',
        status: 'active',
        gitRepoUrl: 'https://github.com/example/payments',
        gitRevision: 'main',
        manifestPath: 'deploy/dev',
        clusterName: 'cluster-a',
        errorCount: 0,
        createdAt: '2026-06-01T00:00:00Z',
        updatedAt: '2026-06-05T00:00:00Z',
      },
    ]);
    mockGetEnvironment.mockResolvedValue({
      id: 'env-1',
      teamId: 'team-1',
      name: 'payments-dev',
      description: 'Development environment',
      namespace: 'idp-team-1-payments-dev',
      status: 'active',
      gitRepoUrl: 'https://github.com/example/payments',
      gitRevision: 'main',
      manifestPath: 'deploy/dev',
      clusterName: 'cluster-a',
      errorCount: 0,
      createdAt: '2026-06-01T00:00:00Z',
      updatedAt: '2026-06-05T00:00:00Z',
    });
    mockGetEnvironmentWorkloads.mockResolvedValue({
      environmentId: 'env-1',
      namespace: 'idp-team-1-payments-dev',
      summary: {
        totalWorkloads: 1,
        healthyWorkloads: 1,
        degradedWorkloads: 0,
        totalPods: 2,
        runningPods: 2,
        pendingPods: 0,
        failedPods: 0,
      },
      workloads: [
        {
          name: 'api',
          kind: 'Deployment',
          status: 'Running',
          desiredReplicas: 2,
          readyReplicas: 2,
          image: 'ghcr.io/example/api:latest',
        },
      ],
    });
    mockSyncEnvironment.mockResolvedValue(undefined);
    mockCreateEnvironment.mockResolvedValue({ id: 'env-1' });
    mockDeleteEnvironment.mockResolvedValue(undefined);
    mockGetDashboardSummary.mockResolvedValue({
      environmentCount: 1,
      activeCount: 1,
      creatingCount: 0,
      alertCount: 0,
      recentEnvironments: [
        {
          id: 'env-1',
          teamId: 'team-1',
          name: 'payments-dev',
          description: 'Development environment',
          namespace: 'idp-team-1-payments-dev',
          status: 'active',
          gitRepoUrl: 'https://github.com/example/payments',
          gitRevision: 'main',
          manifestPath: 'deploy/dev',
          clusterName: 'cluster-a',
          errorCount: 0,
          createdAt: '2026-06-01T00:00:00Z',
          updatedAt: '2026-06-05T00:00:00Z',
        },
      ],
      costSummary: null,
      recommendations: [],
      hasPartialData: false,
    });
    mockListTemplates.mockResolvedValue([]);
    mockListTemplateVersions.mockResolvedValue([]);
    mockListDeliveryTargets.mockResolvedValue([]);

    useAuthStore.setState({
      hasHydratedAuth: false,
      isAuthenticated: false,
      user: null,
      tokens: null,
    });
  });

  it('renders environment list and navigates to detail', async () => {
    const user = userEvent.setup();
    renderApp('/environments');

    expect(await screen.findByText('payments-dev')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'payments-dev' }));

    await waitFor(() => {
      expect(mockGetEnvironment).toHaveBeenCalledWith('env-1');
    });
  });

  it('renders dashboard widgets from shared environment data', async () => {
    renderApp('/');

    expect(await screen.findByText('Welcome back, Platform Admin')).toBeInTheDocument();
    expect(screen.getByText('Total environments')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
  });

  it('renders create environment form and submits valid input successfully', async () => {
    const user = userEvent.setup();
    mockCreateEnvironment.mockResolvedValue({
      id: 'env-new',
      teamId: 'team-1',
      name: 'payments-dev',
      namespace: 'idp-team-1-payments-dev',
      status: 'active',
      gitRepoUrl: 'https://github.com/example/payments',
      gitRevision: 'main',
      manifestPath: 'deploy/dev',
      clusterName: '',
      errorCount: 0,
      createdAt: '2026-06-10T00:00:00Z',
      updatedAt: '2026-06-10T00:00:00Z',
    });
    mockListDeliveryTargets.mockResolvedValue([
      {
        id: 'target-1',
        name: 'dev-cluster-a',
        displayName: 'Development Cluster A',
        availabilityState: 'available',
        healthState: 'healthy',
      },
    ]);

    renderApp('/environments/new');

    expect(await screen.findByRole('heading', { name: 'Create environment' })).toBeInTheDocument();
    expect(screen.getByText('Basic details')).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText('payments-dev');
    fireEvent.change(nameInput, { target: { value: 'payments-dev' } });
    await user.click(screen.getByText('Continue'));

    expect(await screen.findByText('Source configuration')).toBeInTheDocument();
    const gitRepoInput = screen.getByPlaceholderText('https://github.com/org/repo.git');
    fireEvent.change(gitRepoInput, { target: { value: 'https://github.com/example/payments' } });
    const manifestInput = screen.getByPlaceholderText('deploy/overlays/dev');
    fireEvent.change(manifestInput, { target: { value: 'deploy/dev' } });
    const gitRevisionInput = screen.getByDisplayValue('main');
    fireEvent.change(gitRevisionInput, { target: { value: 'main' } });
    await user.click(screen.getByText('Continue'));

    expect(await screen.findByText('Deployment settings')).toBeInTheDocument();
    await user.click(screen.getByText('Continue'));

    expect(await screen.findByText('Review configuration')).toBeInTheDocument();
    expect(screen.getByText('payments-dev')).toBeInTheDocument();
    expect(screen.getByText('https://github.com/example/payments')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Create environment' }));

    await waitFor(() => {
      expect(mockCreateEnvironment).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'payments-dev',
          gitRepoUrl: 'https://github.com/example/payments',
          manifestPath: 'deploy/dev',
          gitRevision: 'main',
        }),
      );
    });
  });

  it('shows validation error for empty required fields in create flow', async () => {
    const user = userEvent.setup();
    mockListDeliveryTargets.mockResolvedValue([]);

    renderApp('/environments/new');
    expect(await screen.findByRole('heading', { name: 'Create environment' })).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText('payments-dev');
    await user.clear(nameInput);
    await user.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });

  it('renders template and template-version controls in deployment step', async () => {
    const user = userEvent.setup();
    mockListTemplates.mockResolvedValue([
      { id: 'tpl-1', name: 'Standard Microservice', description: 'A standard template' },
    ]);
    mockListTemplateVersions.mockResolvedValue([
      {
        id: 'ver-1',
        templateId: 'tpl-1',
        version: 'v1.2.0',
        isLatest: true,
        isStable: true,
        parameters: [
          { name: 'replicas', displayName: 'Replicas', type: 'number', required: true, defaultValue: '2' },
          { name: 'domain', displayName: 'Domain', type: 'string', required: false },
        ],
      },
    ]);
    mockListDeliveryTargets.mockResolvedValue([]);

    renderApp('/environments/new');
    expect(await screen.findByRole('heading', { name: 'Create environment' })).toBeInTheDocument();

    // Navigate to Deployment step
    const nameInput = screen.getByPlaceholderText('payments-dev');
    fireEvent.change(nameInput, { target: { value: 'payments-dev' } });
    await user.click(screen.getByText('Continue'));

    const gitRepoInput = screen.getByPlaceholderText('https://github.com/org/repo.git');
    fireEvent.change(gitRepoInput, { target: { value: 'https://github.com/example/payments' } });
    const manifestInput = screen.getByPlaceholderText('deploy/overlays/dev');
    fireEvent.change(manifestInput, { target: { value: 'deploy/dev' } });
    await user.click(screen.getByText('Continue'));

    expect(await screen.findByText('Deployment settings')).toBeInTheDocument();

    // Select template
    const templateSelect = screen.getByText('Select a template');
    await user.click(templateSelect);
    await user.click(await screen.findByText('Standard Microservice'));

    // Open version dropdown and select a version
    const versionSelect = screen.getByText('Select a version');
    await user.click(versionSelect);
    await user.click(await screen.findByText('v1.2.0'));

    // Template parameter inputs should be visible
    expect(screen.getByText('Replicas')).toBeInTheDocument();
    expect(screen.getByText('Domain')).toBeInTheDocument();
  });

  it('shows delivery targets with unavailable targets disabled', async () => {
    const user = userEvent.setup();
    mockListDeliveryTargets.mockResolvedValue([
      { id: 'tgt-1', name: 'dev-a', displayName: 'Dev Cluster A', availabilityState: 'available', healthState: 'healthy' },
      { id: 'tgt-2', name: 'dev-b', displayName: 'Dev Cluster B', availabilityState: 'unavailable', healthState: 'degraded' },
    ]);

    renderApp('/environments/new');
    expect(await screen.findByRole('heading', { name: 'Create environment' })).toBeInTheDocument();

    // Navigate to Deployment step
    const nameInput = screen.getByPlaceholderText('payments-dev');
    fireEvent.change(nameInput, { target: { value: 'test-env' } });
    await user.click(screen.getByText('Continue'));

    const gitRepoInput = screen.getByPlaceholderText('https://github.com/org/repo.git');
    fireEvent.change(gitRepoInput, { target: { value: 'https://github.com/example/repo' } });
    const manifestInput = screen.getByPlaceholderText('deploy/overlays/dev');
    fireEvent.change(manifestInput, { target: { value: 'deploy/dev' } });
    await user.click(screen.getByText('Continue'));

    expect(await screen.findByText('Deployment settings')).toBeInTheDocument();
    expect(screen.getByText('Placement')).toBeInTheDocument();

    // Open delivery target dropdown to see options including unavailable target
    const targetSelect = screen.getByText('Select a delivery target');
    await user.click(targetSelect);

    expect(await screen.findByText('Dev Cluster A')).toBeInTheDocument();
    expect(screen.getByText('Dev Cluster B (unavailable)')).toBeInTheDocument();
  });

  it('shows validation error on 400 response with field errors', async () => {
    const user = userEvent.setup();
    mockCreateEnvironment.mockRejectedValue({
      response: {
        status: 400,
        data: {
          message: 'Validation failed',
          field_errors: { git_repo_url: 'Must be a valid HTTPS URL' },
        },
      },
    });
    mockListDeliveryTargets.mockResolvedValue([]);

    renderApp('/environments/new');
    expect(await screen.findByRole('heading', { name: 'Create environment' })).toBeInTheDocument();

    // Fill and submit the form
    const nameInput = screen.getByPlaceholderText('payments-dev');
    fireEvent.change(nameInput, { target: { value: 'test-env' } });
    await user.click(screen.getByText('Continue'));

    const gitRepoInput = screen.getByPlaceholderText('https://github.com/org/repo.git');
    fireEvent.change(gitRepoInput, { target: { value: 'https://github.com/example/repo' } });
    const manifestInput = screen.getByPlaceholderText('deploy/overlays/dev');
    fireEvent.change(manifestInput, { target: { value: 'deploy/dev' } });
    await user.click(screen.getByText('Continue'));

    await user.click(screen.getByText('Continue'));
    await user.click(screen.getByRole('button', { name: 'Create environment' }));

    // Error alert should appear
    expect(await screen.findByText('Please fix the highlighted fields')).toBeInTheDocument();

    // Navigate back to Source step to see inline field error
    await user.click(screen.getByText('Back'));
    await user.click(screen.getByText('Back'));
    expect(await screen.findByText('Must be a valid HTTPS URL')).toBeInTheDocument();
  });

  it('shows conflict error on 409 response', async () => {
    const user = userEvent.setup();
    mockCreateEnvironment.mockRejectedValue({
      response: { status: 409, data: { message: 'An environment named test-env already exists.' } },
    });
    mockListDeliveryTargets.mockResolvedValue([]);

    renderApp('/environments/new');
    expect(await screen.findByRole('heading', { name: 'Create environment' })).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText('payments-dev');
    fireEvent.change(nameInput, { target: { value: 'test-env' } });
    await user.click(screen.getByText('Continue'));

    const gitRepoInput = screen.getByPlaceholderText('https://github.com/org/repo.git');
    fireEvent.change(gitRepoInput, { target: { value: 'https://github.com/example/repo' } });
    const manifestInput = screen.getByPlaceholderText('deploy/overlays/dev');
    fireEvent.change(manifestInput, { target: { value: 'deploy/dev' } });
    await user.click(screen.getByText('Continue'));
    await user.click(screen.getByText('Continue'));
    await user.click(screen.getByRole('button', { name: 'Create environment' }));

    expect(await screen.findByText('Resource conflict')).toBeInTheDocument();
    expect(screen.getByText('An environment named test-env already exists.')).toBeInTheDocument();
    expect(screen.getByText('You can retry this operation.')).toBeInTheDocument();
  });

  it('shows option load error with retry action', async () => {
    const user = userEvent.setup();
    mockListDeliveryTargets.mockRejectedValue(new Error('Network error'));
    mockListTemplates.mockResolvedValue([]);

    renderApp('/environments/new');
    expect(await screen.findByRole('heading', { name: 'Create environment' })).toBeInTheDocument();

    // Navigate to Deployment step
    const nameInput = screen.getByPlaceholderText('payments-dev');
    fireEvent.change(nameInput, { target: { value: 'test-env' } });
    await user.click(screen.getByText('Continue'));

    const gitRepoInput = screen.getByPlaceholderText('https://github.com/org/repo.git');
    fireEvent.change(gitRepoInput, { target: { value: 'https://github.com/example/repo' } });
    const manifestInput = screen.getByPlaceholderText('deploy/overlays/dev');
    fireEvent.change(manifestInput, { target: { value: 'deploy/dev' } });
    await user.click(screen.getByText('Continue'));

    expect(await screen.findByText('Deployment settings')).toBeInTheDocument();
    expect(screen.getByText('Failed to load delivery targets')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });
});
