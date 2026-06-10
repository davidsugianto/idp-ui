import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiKeyQueryKeys, createApiKey, listApiKeys, revokeApiKey } from '@/services/apiKeys';
import type { CreateApiKeyRequest } from '@/types/apiKey';

export function useApiKeys() {
  return useQuery({
    queryKey: apiKeyQueryKeys.list,
    queryFn: listApiKeys,
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateApiKeyRequest) => createApiKey(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: apiKeyQueryKeys.list });
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => revokeApiKey(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: apiKeyQueryKeys.list });
    },
  });
}
