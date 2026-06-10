import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createEnvironment,
  deleteEnvironment,
  getEnvironment,
  getEnvironmentWorkloads,
  listEnvironments,
  syncEnvironment,
} from '@/services/environments';
import { QUERY_KEYS } from '@/constants/api';
import type { CreateEnvironmentRequest, EnvironmentListQuery } from '@/types/environment';

export const environmentQueryKeys = {
  all: QUERY_KEYS.environments,
  list: (query?: EnvironmentListQuery) => QUERY_KEYS.environmentList(query),
  detail: (id: string) => QUERY_KEYS.environment(id),
  workloads: (id: string) => QUERY_KEYS.environmentWorkloads(id),
};

export function useEnvironments(query?: EnvironmentListQuery) {
  const result = useQuery({
    queryKey: environmentQueryKeys.list(query),
    queryFn: () => listEnvironments(query),
  });

  const filteredData = useMemo(() => {
    const items = result.data ?? [];
    const search = query?.search?.trim().toLowerCase();
    const status = query?.status;
    const team = query?.team?.trim().toLowerCase();
    const cluster = query?.cluster?.trim().toLowerCase();

    return items.filter((environment) => {
      const matchesSearch =
        !search ||
        environment.name.toLowerCase().includes(search) ||
        environment.namespace.toLowerCase().includes(search) ||
        environment.clusterName.toLowerCase().includes(search);
      const matchesStatus = !status || status === 'all' || environment.status === status;
      const matchesTeam = !team || environment.teamId.toLowerCase().includes(team);
      const matchesCluster = !cluster || environment.clusterName.toLowerCase().includes(cluster);
      return matchesSearch && matchesStatus && matchesTeam && matchesCluster;
    });
  }, [query?.cluster, query?.search, query?.status, query?.team, result.data]);

  return {
    ...result,
    data: filteredData,
  };
}

export function useEnvironment(id: string) {
  return useQuery({
    queryKey: environmentQueryKeys.detail(id),
    queryFn: () => getEnvironment(id),
    enabled: Boolean(id),
  });
}

export function useEnvironmentWorkloads(id: string) {
  return useQuery({
    queryKey: environmentQueryKeys.workloads(id),
    queryFn: () => getEnvironmentWorkloads(id),
    enabled: Boolean(id),
  });
}

export function useCreateEnvironment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateEnvironmentRequest) => createEnvironment(request),
    onSuccess: async (environment) => {
      queryClient.setQueryData(environmentQueryKeys.detail(environment.id), environment);
      await queryClient.invalidateQueries({ queryKey: environmentQueryKeys.all });
    },
  });
}

export function useDeleteEnvironment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEnvironment(id),
    onSuccess: async (_data, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: environmentQueryKeys.all }),
        queryClient.removeQueries({ queryKey: environmentQueryKeys.detail(id) }),
        queryClient.removeQueries({ queryKey: environmentQueryKeys.workloads(id) }),
      ]);
    },
  });
}

export function useSyncEnvironment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => syncEnvironment(id),
    onSuccess: async (_data, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: environmentQueryKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: environmentQueryKeys.workloads(id) }),
        queryClient.invalidateQueries({ queryKey: environmentQueryKeys.all }),
      ]);
    },
  });
}
