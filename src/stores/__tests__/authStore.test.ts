import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../authStore';

const mockUser = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  roles: ['developer'],
  groups: ['team-a'],
};

const mockTokens = {
  auth_token: 'auth-token-123',
  expires_in: 300,
};

describe('authStore', () => {
  beforeEach(() => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    useAuthStore.setState({
      hasHydratedAuth: false,
      isAuthenticated: false,
      user: null,
      tokens: null,
    });
  });

  describe('login', () => {
    it('sets isAuthenticated to true', () => {
      useAuthStore.getState().login(mockTokens, mockUser);

      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('stores user and tokens in state', () => {
      useAuthStore.getState().login(mockTokens, mockUser);

      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().tokens).toEqual(mockTokens);
    });
  });

  describe('hydrateAuth', () => {
    it('puts auth into pending hydration state', () => {
      useAuthStore.setState({ hasHydratedAuth: true, isAuthenticated: true, user: mockUser, tokens: mockTokens });

      useAuthStore.getState().hydrateAuth();

      expect(useAuthStore.getState().hasHydratedAuth).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });

  describe('logout', () => {
    it('resets state', () => {
      useAuthStore.getState().login(mockTokens, mockUser);
      document.cookie = 'auth_token=test-cookie; path=/; SameSite=Lax';

      useAuthStore.getState().logout();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().tokens).toBeNull();
    });
  });

  describe('setUser', () => {
    it('updates user in state', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      useAuthStore.getState().setUser(updatedUser);

      expect(useAuthStore.getState().user?.name).toBe('Updated Name');
    });
  });
});
