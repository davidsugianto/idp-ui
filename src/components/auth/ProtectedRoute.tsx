import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import CallbackPage from '@/pages/Auth/CallbackPage';
import AsyncState from '@/components/common/AsyncState';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const hasHydratedAuth = useAuthStore((s) => s.hasHydratedAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hasOidcCallbackParams =
    searchParams.has('auth_token') ||
    searchParams.has('access_token') ||
    searchParams.has('error');

  if (hasOidcCallbackParams) {
    return <CallbackPage />;
  }

  if (!hasHydratedAuth) {
    return <ProtectedRouteFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: `${location.pathname}${location.search}${location.hash}` }} replace />;
  }

  return <>{children}</>;
}

function ProtectedRouteFallback() {
  return <AsyncState isLoading>{null}</AsyncState>;
}

ProtectedRoute.Fallback = ProtectedRouteFallback;

export default ProtectedRoute;
