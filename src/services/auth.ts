import api from './api';
import { API_PATHS } from '@/constants/api';
import { buildAuthorizeUrl } from '@/services/oidc';
import type { User, AuthTokens } from '@/types/user';

interface UserDetailsResponse {
  id: string;
  name: string;
  email: string;
  roles?: string[];
  groups?: string[];
}

export interface OIDCTokenResponse {
  access_token?: string;
  auth_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token?: string;
  token_type?: string;
  user?: User | null;
  user_id?: string;
  email?: string;
  is_admin?: boolean;
}

function unwrapResponseData<T>(payload: T | { data?: T }): T {
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data) {
    return payload.data;
  }

  return payload as T;
}

export function toAuthTokens(payload: OIDCTokenResponse, fallbackAuthToken?: string | null): AuthTokens | null {
  const authToken =
    typeof payload.auth_token === 'string'
      ? payload.auth_token
      : typeof payload.access_token === 'string'
        ? payload.access_token
        : typeof payload.token === 'string'
          ? payload.token
          : fallbackAuthToken ?? null;

  if (!authToken) {
    return null;
  }

  return {
    auth_token: authToken,
    expires_in: typeof payload.expires_in === 'number' ? payload.expires_in : 300,
    refresh_token: typeof payload.refresh_token === 'string' ? payload.refresh_token : undefined,
    token_type: typeof payload.token_type === 'string' ? payload.token_type : undefined,
  };
}

export function startOidcLogin(targetPath?: string) {
  window.location.assign(buildAuthorizeUrl(targetPath));
}

export async function loginWithCredentials(username: string, password: string) {
  const res = await api.post(API_PATHS.AUTH.TOKEN, { username, password });
  return unwrapResponseData<OIDCTokenResponse>(res.data);
}

export async function fetchCurrentUser(authToken?: string | null): Promise<User> {
  const res = await api.get<{ data?: UserDetailsResponse } | UserDetailsResponse>(API_PATHS.AUTH.ME, {
    headers: authToken
      ? {
          Authorization: `Bearer ${authToken}`,
        }
      : undefined,
  });
  const payload = unwrapResponseData<UserDetailsResponse>(res.data);

  return {
    id: payload.id,
    name: payload.name,
    email: payload.email,
    roles: payload.roles ?? [],
    groups: payload.groups ?? [],
  };
}

export async function fetchUserById(
  userId: string,
  options?: { authToken?: string | null; email?: string | null; isAdmin?: boolean },
): Promise<User> {
  const res = await api.get<{ data?: UserDetailsResponse } | UserDetailsResponse>(API_PATHS.USER(userId), {
    headers: options?.authToken
      ? {
          Authorization: `Bearer ${options.authToken}`,
        }
      : undefined,
  });
  const raw = res.data as { data?: UserDetailsResponse; id?: string; name?: string; email?: string; roles?: string[]; groups?: string[] };
  const payload = raw.data ?? (raw.id && raw.name ? { id: raw.id, name: raw.name, email: raw.email || '', roles: raw.roles, groups: raw.groups } : null);

  if (!payload) {
    throw new Error('User details not found');
  }

  return {
    id: payload.id,
    name: payload.name,
    email: payload.email || options?.email || '',
    roles: payload.roles ?? (options?.isAdmin ? ['admin'] : []),
    groups: payload.groups ?? [],
  };
}

export async function refreshToken() {
  const res = await api.post(API_PATHS.AUTH.REFRESH);
  return unwrapResponseData<OIDCTokenResponse>(res.data);
}

export async function probeAuthenticatedSession() {
  await api.get(API_PATHS.AUTH.ME);
}

export async function logoutUser() {
  await api.post(API_PATHS.AUTH.LOGOUT);
}
