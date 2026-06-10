import { useQuery } from '@tanstack/react-query';
import { adminQueryKeys, listAdminUsers, listAuditLogs, listRoles, listTeams } from '@/services/admin';

export function useAdminUsers() {
  return useQuery({
    queryKey: adminQueryKeys.users,
    queryFn: listAdminUsers,
  });
}

export function useAdminTeams() {
  return useQuery({
    queryKey: adminQueryKeys.teams,
    queryFn: listTeams,
  });
}

export function useAdminRoles() {
  return useQuery({
    queryKey: adminQueryKeys.roles,
    queryFn: listRoles,
  });
}

export function useAuditLogs() {
  return useQuery({
    queryKey: adminQueryKeys.auditLogs,
    queryFn: listAuditLogs,
  });
}
