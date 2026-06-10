import api from './api';
import { API_PATHS, QUERY_KEYS } from '@/constants/api';
import type { AdminUserRecord, AuditLogRecord, RoleRecord, TeamRecord } from '@/types/admin';

interface AdminUserApiResponse {
  id: string;
  name?: string;
  email: string;
  status?: string;
  roles?: string[];
  groups?: string[];
}

interface TeamApiResponse {
  id: string;
  name: string;
  description?: string;
  member_count?: number;
}

interface RoleApiResponse {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
}

interface AuditLogApiResponse {
  id: string;
  actor?: string;
  action: string;
  resource: string;
  outcome?: string;
  created_at?: string;
  timestamp?: string;
}

type CollectionPayload<T> =
  | T[]
  | {
      data?: T[];
      items?: T[];
      results?: T[];
      users?: T[];
      teams?: T[];
      roles?: T[];
      audit_logs?: T[];
      auditLogs?: T[];
    };

function unwrapCollection<T>(payload: CollectionPayload<T>, keys: string[]): T[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.data)) {
      return payload.data;
    }

    if (Array.isArray(payload.items)) {
      return payload.items;
    }

    if (Array.isArray(payload.results)) {
      return payload.results;
    }

    for (const key of keys) {
      const value = payload[key as keyof typeof payload];
      if (Array.isArray(value)) {
        return value;
      }
    }
  }

  return [];
}

function normalizeAdminUser(payload: AdminUserApiResponse): AdminUserRecord {
  return {
    id: payload.id,
    name: payload.name ?? payload.email,
    email: payload.email,
    status: payload.status ?? 'active',
    roles: payload.roles ?? [],
    groups: payload.groups ?? [],
  };
}

function normalizeTeam(payload: TeamApiResponse): TeamRecord {
  return {
    id: payload.id,
    name: payload.name,
    description: payload.description,
    memberCount: payload.member_count ?? 0,
  };
}

function normalizeRole(payload: RoleApiResponse): RoleRecord {
  return {
    id: payload.id,
    name: payload.name,
    description: payload.description,
    permissions: payload.permissions ?? [],
  };
}

function normalizeAuditLog(payload: AuditLogApiResponse): AuditLogRecord {
  return {
    id: payload.id,
    actor: payload.actor ?? 'unknown',
    action: payload.action,
    resource: payload.resource,
    outcome: payload.outcome ?? 'success',
    createdAt: payload.created_at ?? payload.timestamp ?? '',
  };
}

export const adminQueryKeys = {
  users: QUERY_KEYS.adminUsers,
  teams: QUERY_KEYS.adminTeams,
  roles: QUERY_KEYS.adminRoles,
  auditLogs: QUERY_KEYS.auditLogs,
};

export async function listAdminUsers(): Promise<AdminUserRecord[]> {
  const res = await api.get<CollectionPayload<AdminUserApiResponse>>(API_PATHS.USERS);
  const payload = unwrapCollection(res.data, ['users']);
  return payload.map(normalizeAdminUser);
}

export async function listTeams(): Promise<TeamRecord[]> {
  const res = await api.get<CollectionPayload<TeamApiResponse>>(API_PATHS.TEAMS);
  const payload = unwrapCollection(res.data, ['teams']);
  return payload.map(normalizeTeam);
}

export async function listRoles(): Promise<RoleRecord[]> {
  const res = await api.get<CollectionPayload<RoleApiResponse>>(API_PATHS.ROLES);
  const payload = unwrapCollection(res.data, ['roles']);
  return payload.map(normalizeRole);
}

export async function listAuditLogs(): Promise<AuditLogRecord[]> {
  const res = await api.get<CollectionPayload<AuditLogApiResponse>>(API_PATHS.AUDIT_LOGS);
  const payload = unwrapCollection(res.data, ['audit_logs', 'auditLogs']);
  return payload.map(normalizeAuditLog);
}
