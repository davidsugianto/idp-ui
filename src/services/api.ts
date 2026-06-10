import axios from 'axios';
import { refreshToken } from '@/services/auth';
import { useAuthStore } from '@/stores/authStore';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = typeof originalRequest?.url === 'string' && originalRequest.url.includes('/auth/oidc/refresh');

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        const data = await refreshToken();
        const authToken =
          typeof data?.auth_token === 'string'
            ? data.auth_token
            : typeof data?.access_token === 'string'
              ? data.access_token
              : null;

        useAuthStore.getState().setAuthenticated(true);
        if (authToken) {
          useAuthStore.getState().setTokens({
            auth_token: authToken,
            expires_in: typeof data?.expires_in === 'number' ? data.expires_in : 300,
          });
        }

        return api(originalRequest);
      } catch {
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  },
);

export default api;
