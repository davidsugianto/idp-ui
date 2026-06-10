import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../AuthProvider';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types/user';

// Mock the auth service to avoid real HTTP calls
vi.mock('@/services/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/auth')>();

  return {
    ...actual,
    loginWithCredentials: vi.fn(),
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

describe('AuthProvider', () => {
  beforeEach(() => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    useAuthStore.setState({
      hasHydratedAuth: true,
      isAuthenticated: false,
      user: null,
      tokens: null,
    });
  });

  it('renders children', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <div>Child Content</div>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('provides auth context with isAuthenticated from store', () => {
    useAuthStore.setState({ hasHydratedAuth: true, isAuthenticated: true, user: mockUser });

    render(
      <MemoryRouter>
        <AuthProvider>
          <div>Content</div>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});