import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import ProtectedRoute from '../ProtectedRoute';
import type { User } from '@/types/user';

vi.mock('@/pages/Auth/CallbackPage', () => ({
  default: () => <div>Callback Page</div>,
}));

const mockUser: User = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  roles: ['developer'],
  groups: ['team-a'],
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    useAuthStore.setState({
      hasHydratedAuth: true,
      isAuthenticated: false,
      user: null,
      tokens: null,
    });
  });

  it('renders children when authenticated', () => {
    useAuthStore.setState({ hasHydratedAuth: true, isAuthenticated: true, user: mockUser });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders callback page while callback params are present', () => {
    useAuthStore.setState({ hasHydratedAuth: true, isAuthenticated: true, user: mockUser });

    render(
      <MemoryRouter initialEntries={['/?auth_token=test']}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText('Callback Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
