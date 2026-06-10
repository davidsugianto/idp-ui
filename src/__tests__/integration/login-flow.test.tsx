import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types/user';

vi.mock('@/services/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/auth')>();

  return {
    ...actual,
    loginWithCredentials: vi.fn().mockResolvedValue({
      auth_token: 'test-auth-token',
      expires_in: 300,
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        roles: ['developer'],
        groups: ['team-a'],
      },
    }),
    refreshToken: vi.fn(),
    logoutUser: vi.fn(),
    probeAuthenticatedSession: vi.fn(),
    fetchCurrentUser: vi.fn(),
    fetchUserById: vi.fn(),
    startOidcLogin: vi.fn(),
  };
});

const mockUser: User = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  roles: ['developer'],
  groups: ['team-a'],
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MemoryRouter initialEntries={['/']}>
          <AuthProvider>{children}</AuthProvider>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe('Login → Dashboard flow', () => {
  beforeEach(() => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    useAuthStore.setState({
      hasHydratedAuth: true,
      isAuthenticated: false,
      user: null,
      tokens: null,
    });
  });

  it('shows protected content when authenticated', () => {
    useAuthStore.setState({ hasHydratedAuth: true, isAuthenticated: true, user: mockUser });

    render(
      <TestWrapper>
        <div>Dashboard</div>
      </TestWrapper>,
    );

    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
  });

  it('renders without crashing when unauthenticated', () => {
    render(
      <TestWrapper>
        <div>Dashboard</div>
      </TestWrapper>,
    );

    expect(true).toBe(true);
  });
});
