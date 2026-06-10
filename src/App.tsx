import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import EnvironmentListPage from './pages/Environments/EnvironmentListPage';
import EnvironmentDetailPage from './pages/Environments/EnvironmentDetailPage';
import EnvironmentCreatePage from './pages/Environments/EnvironmentCreatePage';
import LoginPage from './pages/Auth/LoginPage';
import CallbackPage from './pages/Auth/CallbackPage';
import {
  AdminDashboardPage,
  AuditLogPage,
  RoleManagementPage,
  TeamManagementPage,
  UserManagementPage,
} from './pages/Admin';
import SettingsPage from './pages/Settings/SettingsPage';
import APIKeyPage from './pages/Settings/APIKeyPage';
import NotFoundPage from './pages/Errors/NotFoundPage';
import ServerErrorPage from './pages/Errors/ServerErrorPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<CallbackPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="environments" element={<EnvironmentListPage />} />
          <Route path="environments/new" element={<EnvironmentCreatePage />} />
          <Route path="environments/:id" element={<EnvironmentDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/api-keys" element={<APIKeyPage />} />
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <AdminRoute>
                <UserManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/teams"
            element={
              <AdminRoute>
                <TeamManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/roles"
            element={
              <AdminRoute>
                <RoleManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/audit-logs"
            element={
              <AdminRoute>
                <AuditLogPage />
              </AdminRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;