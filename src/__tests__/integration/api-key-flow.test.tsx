import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/theme/ThemeProvider';
import App from '@/App';
import { useAuthStore } from '@/stores/authStore';

const mockListApiKeys = vi.fn();
const mockCreateApiKey = vi.fn();
const mockRevokeApiKey = vi.fn();

vi.mock('@/services/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/auth')>();

  return {
    ...actual,
    loginWithCredentials: vi.fn(),
    refreshToken: vi.fn().mockResolvedValue({
      auth_token: 'test-token',
      expires_in: 300,
      user_id: 'user-1',
      email: 'developer@example.com',
      is_admin: false,
    }),
    logoutUser: vi.fn(),
    probeAuthenticatedSession: vi.fn(),
    fetchCurrentUser: vi.fn().mockResolvedValue({
      id: 'user-1',
      name: 'Developer User',
      email: 'developer@example.com',
      roles: ['developer'],
      groups: ['team-a'],
    }),
    fetchUserById: vi.fn().mockResolvedValue({
      id: 'user-1',
      name: 'Developer User',
      email: 'developer@example.com',
      roles: ['developer'],
      groups: ['team-a'],
    }),
    startOidcLogin: vi.fn(),
  };
});

vi.mock('@/services/apiKeys', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/apiKeys')>();

  return {
    ...actual,
    listApiKeys: (...args: unknown[]) => mockListApiKeys(...args),
    createApiKey: (...args: unknown[]) => mockCreateApiKey(...args),
    revokeApiKey: (...args: unknown[]) => mockRevokeApiKey(...args),
  };
});

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

describe('API key flow', () => {
  beforeEach(() => {
    mockListApiKeys.mockReset();
    mockCreateApiKey.mockReset();
    mockRevokeApiKey.mockReset();

    mockListApiKeys.mockResolvedValue([
      {
        id: 'key-1',
        name: 'Existing CI Key',
        prefix: 'idp_ci',
        createdAt: '2026-06-01T00:00:00Z',
        expiresAt: null,
        lastUsedAt: '2026-06-05T12:00:00Z',
        status: 'active',
      },
    ]);
    mockCreateApiKey.mockResolvedValue({
      id: 'key-2',
      name: 'New Deploy Key',
      prefix: 'idp_new',
      createdAt: '2026-06-08T00:00:00Z',
      expiresAt: null,
      lastUsedAt: null,
      status: 'active',
      secret: 'secret-value-123',
    });
    mockRevokeApiKey.mockResolvedValue(undefined);

    useAuthStore.setState({
      hasHydratedAuth: false,
      isAuthenticated: false,
      user: null,
      tokens: null,
    });
  });

  it('lists, creates, and revokes API keys from settings', async () => {
    const user = userEvent.setup();
    renderApp('/settings/api-keys');

    expect(await screen.findByText('Existing CI Key')).toBeInTheDocument();
    expect(screen.getByText('idp_ci')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Create API Key' }));
    const nameInput = screen.getByPlaceholderText('CI deployment key');
    await user.type(nameInput, 'New Deploy Key');
    await user.click(screen.getByRole('button', { name: 'Create key' }));

    await waitFor(() => {
      expect(mockCreateApiKey).toHaveBeenCalledWith({
        name: 'New Deploy Key',
        expiresAt: undefined,
      });
    });

    expect(await screen.findByText('Copy your new API key now')).toBeInTheDocument();
    expect(screen.getByText('secret-value-123')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockListApiKeys).toHaveBeenCalledTimes(2);
    });

    await user.click(screen.getByRole('button', { name: 'Revoke' }));

    await waitFor(() => {
      expect(mockRevokeApiKey).toHaveBeenCalledWith('key-1');
    });
  });
});
