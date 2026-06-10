import { API_PATHS } from '@/constants/api';

const oidcConfig = {
  issuer: import.meta.env.VITE_OIDC_ISSUER || 'http://localhost:8081/realms/idp-core',
  clientId: import.meta.env.VITE_OIDC_CLIENT_ID || 'idp-core',
  redirectUri: import.meta.env.VITE_OIDC_REDIRECT_URI || `${window.location.origin}/auth/callback`,
};

export function buildAuthorizeUrl(targetPath?: string) {
  const params = new URLSearchParams({
    redirect_uri: oidcConfig.redirectUri,
  });

  if (targetPath) {
    params.set('state', targetPath);
  }

  return `/api${API_PATHS.AUTH.LOGIN}?${params.toString()}`;
}

export function buildLogoutUrl() {
  const params = new URLSearchParams({
    post_logout_redirect_uri: window.location.origin,
    client_id: oidcConfig.clientId,
  });

  return `${oidcConfig.issuer}/protocol/openid-connect/logout?${params.toString()}`;
}

export function buildTokenUrl() {
  return `${oidcConfig.issuer}/protocol/openid-connect/token`;
}

export function buildUserInfoUrl() {
  return `${oidcConfig.issuer}/protocol/openid-connect/userinfo`;
}

export function parseOidcState(state?: string | null) {
  if (!state) {
    return '/';
  }

  return state.startsWith('/') ? state : '/';
}
