import { create } from 'zustand';
import type { AuthState, User, AuthTokens } from '@/types/user';

interface AuthStore extends AuthState {
  hydrateAuth: () => void;
  login: (tokens: AuthTokens, user: User | null) => void;
  logout: () => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setHydratedAuth: (isAuthenticated: boolean) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: User | null) => void;
}

function clearAuthCookie() {
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
}

export const useAuthStore = create<AuthStore>((set) => ({
  hasHydratedAuth: false,
  isAuthenticated: false,
  user: null,
  tokens: null,
  hydrateAuth: () => {
    set((state) => ({ ...state, hasHydratedAuth: false }));
  },
  login: (tokens, user) => {
    set({ hasHydratedAuth: true, isAuthenticated: true, tokens, user });
  },
  logout: () => {
    clearAuthCookie();
    set({ hasHydratedAuth: true, isAuthenticated: false, tokens: null, user: null });
  },
  setTokens: (tokens) => {
    set((state) => ({
      hasHydratedAuth: true,
      isAuthenticated: tokens ? true : state.isAuthenticated,
      tokens,
      user: state.user,
    }));
  },
  setHydratedAuth: (isAuthenticated) => {
    set((state) => ({
      hasHydratedAuth: true,
      isAuthenticated,
      tokens: isAuthenticated ? state.tokens : null,
      user: isAuthenticated ? state.user : null,
    }));
  },
  setAuthenticated: (isAuthenticated) => {
    set((state) => ({
      hasHydratedAuth: state.hasHydratedAuth,
      isAuthenticated,
      tokens: isAuthenticated ? state.tokens : null,
      user: isAuthenticated ? state.user : null,
    }));
  },
  setUser: (user) => set({ user }),
}));
