export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  status: string;
  roles: string[];
  groups: string[];
}

export interface TeamRecord {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
}

export interface RoleRecord {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
}

export interface AuditLogRecord {
  id: string;
  actor: string;
  action: string;
  resource: string;
  outcome: string;
  createdAt: string;
}
