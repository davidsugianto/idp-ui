import api from './api';
import { API_PATHS, QUERY_KEYS } from '@/constants/api';
import type { ApiKeyRecord, CreateApiKeyRequest } from '@/types/apiKey';

interface ApiKeyApiResponse {
  id: string;
  name: string;
  prefix?: string;
  key_prefix?: string;
  created_at?: string;
  createdAt?: string;
  expires_at?: string | null;
  expiresAt?: string | null;
  last_used_at?: string | null;
  lastUsedAt?: string | null;
  status?: string;
  secret?: string;
  api_key?: string;
}

function unwrapResponseData<T>(payload: T | { data?: T }): T {
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data) {
    return payload.data;
  }

  return payload as T;
}

function normalizeApiKey(payload: ApiKeyApiResponse): ApiKeyRecord {
  return {
    id: payload.id,
    name: payload.name,
    prefix: payload.prefix ?? payload.key_prefix ?? '',
    createdAt: payload.createdAt ?? payload.created_at ?? '',
    expiresAt: payload.expiresAt ?? payload.expires_at ?? null,
    lastUsedAt: payload.lastUsedAt ?? payload.last_used_at ?? null,
    status: payload.status ?? 'active',
    secret: payload.secret ?? payload.api_key,
  };
}

export const apiKeyQueryKeys = {
  list: QUERY_KEYS.apiKeys,
};

export async function listApiKeys(): Promise<ApiKeyRecord[]> {
  const res = await api.get<ApiKeyApiResponse[] | { data?: ApiKeyApiResponse[] }>(API_PATHS.API_KEYS);
  const payload = unwrapResponseData<ApiKeyApiResponse[]>(res.data);
  return payload.map(normalizeApiKey);
}

export async function createApiKey(request: CreateApiKeyRequest): Promise<ApiKeyRecord> {
  const res = await api.post<ApiKeyApiResponse | { data?: ApiKeyApiResponse }>(API_PATHS.API_KEYS, {
    name: request.name,
    expires_at: request.expiresAt,
  });
  return normalizeApiKey(unwrapResponseData<ApiKeyApiResponse>(res.data));
}

export async function revokeApiKey(id: string) {
  await api.delete(API_PATHS.API_KEY(id));
}
