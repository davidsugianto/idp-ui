export interface ApiKeyRecord {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  expiresAt?: string | null;
  lastUsedAt?: string | null;
  status: string;
  secret?: string;
}

export interface CreateApiKeyRequest {
  name: string;
  expiresAt?: string;
}
