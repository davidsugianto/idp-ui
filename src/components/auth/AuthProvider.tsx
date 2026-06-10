import axios from 'axios';
import { useCallback, useEffect, useMemo, type ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import {
  fetchCurrentUser,
  fetchUserById,
  loginWithCredentials,
  logoutUser,
  probeAuthenticatedSession,
  refreshToken,
  startOidcLogin,
  toAuthTokens,
} from '@/services/auth';
import AuthContext from './AuthContext';

function decodeJwtPayload(token: string) {
  const [, payload] = token.split('.');

  if (!payload) {
    return null;
  }

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    hasHydratedAuth,
    isAuthenticated,
    user,
    tokens,
    hydrateAuth,
    login: storeLogin,
    logout: storeLogout,
    setTokens,
    setAuthenticated,
    setHydratedAuth,
    setUser,
  } = useAuthStore();

  const hydrateUserProfile = useCallback(
    async (authToken: string, fallback?: { userId?: string; email?: string; isAdmin?: boolean }) => {
      try {
        const currentUser = await fetchCurrentUser(authToken);
        setUser(currentUser);
        return;
      } catch (err: unknown) {
        if (!axios.isAxiosError(err) || err.response?.status !== 404) {
          if (axios.isAxiosError(err) && err.response?.status === 401) {
            throw err;
          }
        }
      }

      const tokenPayload = decodeJwtPayload(authToken);
      const userId =
        fallback?.userId ||
        (typeof tokenPayload?.user_id === 'string'
          ? tokenPayload.user_id
          : typeof tokenPayload?.sub === 'string'
            ? tokenPayload.sub
            : null);
      const email = fallback?.email || (typeof tokenPayload?.email === 'string' ? tokenPayload.email : undefined);
      const isAdmin =
        fallback?.isAdmin ?? (typeof tokenPayload?.is_admin === 'boolean' ? tokenPayload.is_admin : false);

      if (!userId) {
        if (email) {
          setUser({
            id: 'me',
            name: email,
            email,
            roles: isAdmin ? ['admin'] : [],
            groups: [],
          });
        }
        return;
      }

      try {
        const nextUser = await fetchUserById(userId, { authToken, email, isAdmin });
        setUser(nextUser);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          throw err;
        }

        setUser({
          id: userId,
          name: email || 'User',
          email: email || '',
          roles: isAdmin ? ['admin'] : [],
          groups: [],
        });
      }
    },
    [setUser],
  );

  const bootstrapAuth = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const data = await refreshToken();

        if (signal?.aborted) {
          return;
        }

        const nextTokens = toAuthTokens(data);

        if (!nextTokens) {
          throw new Error('No auth token returned during refresh');
        }

        setTokens(nextTokens);
        await hydrateUserProfile(nextTokens.auth_token, {
          userId: typeof data?.user_id === 'string' ? data.user_id : undefined,
          email: typeof data?.email === 'string' ? data.email : undefined,
          isAdmin: typeof data?.is_admin === 'boolean' ? data.is_admin : false,
        });

        if (!signal?.aborted) {
          setHydratedAuth(true);
        }
        return;
      } catch {
        if (signal?.aborted) {
          return;
        }

        try {
          await probeAuthenticatedSession();
          const currentUser = await fetchCurrentUser();
          if (!signal?.aborted) {
            setUser(currentUser);
            setAuthenticated(true);
            setHydratedAuth(true);
          }
        } catch {
          if (!signal?.aborted) {
            storeLogout();
          }
        }
      }
    },
    [hydrateUserProfile, setAuthenticated, setHydratedAuth, setTokens, setUser, storeLogout],
  );

  useEffect(() => {
    const controller = new AbortController();

    hydrateAuth();
    void bootstrapAuth(controller.signal);

    return () => {
      controller.abort();
    };
  }, [bootstrapAuth, hydrateAuth]);

  useEffect(() => {
    if (!isAuthenticated || user || !tokens?.auth_token) {
      return;
    }

    void hydrateUserProfile(tokens.auth_token).catch(() => {
      storeLogout();
    });
  }, [hydrateUserProfile, isAuthenticated, storeLogout, tokens?.auth_token, user]);

  const completeLogin = useCallback(
    async (payload: {
      authToken: string;
      expiresIn?: number;
      refreshToken?: string;
      tokenType?: string;
      userId?: string;
      email?: string;
      isAdmin?: boolean;
    }) => {
      storeLogin(
        {
          auth_token: payload.authToken,
          expires_in: typeof payload.expiresIn === 'number' ? payload.expiresIn : 300,
          refresh_token: payload.refreshToken,
          token_type: payload.tokenType,
        },
        null,
      );

      await hydrateUserProfile(payload.authToken, {
        userId: payload.userId,
        email: payload.email,
        isAdmin: payload.isAdmin,
      });
    },
    [hydrateUserProfile, storeLogin],
  );

  const login = useCallback(
    async (username: string, password: string) => {
      const data = await loginWithCredentials(username, password);
      const nextTokens = toAuthTokens(data);

      if (!nextTokens) {
        throw new Error('No auth token returned from login');
      }

      if (data.user) {
        storeLogin(nextTokens, data.user);
        return;
      }

      await completeLogin({
        authToken: nextTokens.auth_token,
        expiresIn: nextTokens.expires_in,
        refreshToken: nextTokens.refresh_token,
        tokenType: nextTokens.token_type,
        userId: typeof data.user_id === 'string' ? data.user_id : undefined,
        email: typeof data.email === 'string' ? data.email : undefined,
        isAdmin: typeof data.is_admin === 'boolean' ? data.is_admin : false,
      });
    },
    [completeLogin, storeLogin],
  );

  const loginWithOidc = useCallback((targetPath?: string) => {
    startOidcLogin(targetPath);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      storeLogout();
      window.location.assign('/auth/login');
    }
  }, [storeLogout]);

  const refreshTokens = useCallback(async () => {
    const data = await refreshToken();
    const nextTokens = toAuthTokens(data, tokens?.auth_token ?? null);

    setAuthenticated(true);
    if (nextTokens) {
      setTokens(nextTokens);
    }
  }, [setAuthenticated, setTokens, tokens?.auth_token]);

  const value = useMemo(
    () => ({
      hasHydratedAuth,
      isAuthenticated,
      user,
      login,
      loginWithOidc,
      completeLogin,
      logout,
      refreshTokens,
    }),
    [hasHydratedAuth, isAuthenticated, user, login, loginWithOidc, completeLogin, logout, refreshTokens],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
