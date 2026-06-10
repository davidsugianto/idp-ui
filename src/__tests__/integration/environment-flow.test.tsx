import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

vi.mock('@/services/environments', () => ({
  listEnvironments: (...args: unknown[]) => mockListEnvironments(...args),
  getEnvironment: (...args: unknown[]) => mockGetEnvironment(...args),
  getEnvironmentWorkloads: (...args: unknown[]) => mockGetEnvironmentWorkloads(...args),
  syncEnvironment: (...args: unknown[]) => mockSyncEnvironment(...args),
  createEnvironment: (...args: unknown[]) => mockCreateEnvironment(...args),
  deleteEnvironment: (...args: unknown[]) => mockDeleteEnvironment(...args),
}));

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
});
