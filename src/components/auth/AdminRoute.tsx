import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import UnauthorizedState from '@/components/common/UnauthorizedState';
import AsyncState from '@/components/common/AsyncState';
import type { ReactNode } from 'react';

interface AdminRouteProps {
  children: ReactNode;
}

function AdminRoute({ children }: AdminRouteProps) {
  const hasHydratedAuth = useAuthStore((s) => s.hasHydratedAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!hasHydratedAuth) {
    return <AsyncState isLoading>{null}</AsyncState>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: `${location.pathname}${location.search}${location.hash}` }} replace />;
  }

  const isAdmin = user?.roles?.includes('admin');

  if (!isAdmin) {
    return <UnauthorizedState title="403" description="You do not have permission to access this page." actionLabel="Go Back" onAction={() => window.history.back()} />;
  }

  return <>{children}</>;
}

export default AdminRoute;