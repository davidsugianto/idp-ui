import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import AdminRoute from '../AdminRoute';
import type { User } from '@/types/user';

const adminUser: User = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'admin@example.com',
  roles: ['admin'],
  groups: [],
};

const normalUser: User = {
  id: 'user-1',
  name: 'Normal User',
  email: 'user@example.com',
  roles: ['developer'],
  groups: ['team-a'],
};

describe('AdminRoute', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      tokens: null,
    });
  });

  it('renders children when user has admin role', () => {
    useAuthStore.setState({ isAuthenticated: true, user: adminUser });

    render(
      <MemoryRouter>
        <AdminRoute>
          <div>Admin Content</div>
        </AdminRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('shows 403 when user lacks admin role', () => {
    useAuthStore.setState({ isAuthenticated: true, user: normalUser });

    render(
      <MemoryRouter>
        <AdminRoute>
          <div>Admin Content</div>
        </AdminRoute>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    expect(screen.getAllByText('403')).toHaveLength(2);
  });

  it('redirects to login when not authenticated', () => {
    render(
      <MemoryRouter>
        <AdminRoute>
          <div>Admin Content</div>
        </AdminRoute>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});