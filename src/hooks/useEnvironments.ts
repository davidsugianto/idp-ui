import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createEnvironment,
  createDeliveryTarget,
  createTemplate,
  createTemplateVersion,
  deleteEnvironment,
  deleteDeliveryTarget,
  deleteTemplate,
  getDeliveryTarget,
  getEnvironment,
  getEnvironmentWorkloads,
  getTemplate,
  listEnvironments,
  listDeliveryTargets,
  listTemplates,
  listTemplateVersions,
  syncEnvironment,
  updateDeliveryTarget,
} from '@/services/environments';
import { QUERY_KEYS } from '@/constants/api';
import type {
  CreateEnvironmentRequest,
  CreateTemplateRequest,
  CreateTemplateVersionRequest,
  CreateDeliveryTargetRequest,
  EnvironmentListQuery,
} from '@/types/environment';

export const environmentQueryKeys = {
  all: QUERY_KEYS.environments,
  list: (query?: EnvironmentListQuery) => QUERY_KEYS.environmentList(query),
  detail: (id: string) => QUERY_KEYS.environment(id),
  workloads: (id: string) => QUERY_KEYS.environmentWorkloads(id),
};

export const templateQueryKeys = {
  all: QUERY_KEYS.templates,
  list: (query?: Record<string, unknown>) => QUERY_KEYS.templateList(query),
  detail: (id: string) => QUERY_KEYS.template(id),
  versions: (templateId: string) => QUERY_KEYS.templateVersions(templateId),
  version: (templateId: string, versionId: string) => QUERY_KEYS.templateVersion(templateId, versionId),
};

export const deliveryTargetQueryKeys = {
  all: QUERY_KEYS.deliveryTargets,
  list: (query?: Record<string, unknown>) => QUERY_KEYS.deliveryTargetList(query),
  detail: (id: string) => QUERY_KEYS.deliveryTarget(id),
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

export function useTemplates() {
  return useQuery({
    queryKey: templateQueryKeys.list(),
    queryFn: () => listTemplates(),
  });
}

export function useTemplateVersions(templateId: string) {
  return useQuery({
    queryKey: templateQueryKeys.versions(templateId),
    queryFn: () => listTemplateVersions(templateId),
    enabled: Boolean(templateId),
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: templateQueryKeys.detail(id),
    queryFn: () => getTemplate(id),
    enabled: Boolean(id),
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateTemplateRequest) => createTemplate(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: templateQueryKeys.all });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTemplate(id),
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({ queryKey: templateQueryKeys.all });
      queryClient.removeQueries({ queryKey: templateQueryKeys.detail(id) });
    },
  });
}

export function useCreateTemplateVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ templateId, request }: { templateId: string; request: CreateTemplateVersionRequest }) =>
      createTemplateVersion(templateId, request),
    onSuccess: async (_data, { templateId }) => {
      await queryClient.invalidateQueries({ queryKey: templateQueryKeys.versions(templateId) });
    },
  });
}

export function useDeliveryTarget(id: string) {
  return useQuery({
    queryKey: deliveryTargetQueryKeys.detail(id),
    queryFn: () => getDeliveryTarget(id),
    enabled: Boolean(id),
  });
}

export function useDeliveryTargets() {
  return useQuery({
    queryKey: deliveryTargetQueryKeys.list(),
    queryFn: () => listDeliveryTargets(),
  });
}

export function useCreateDeliveryTarget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateDeliveryTargetRequest) => createDeliveryTarget(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: deliveryTargetQueryKeys.all });
    },
  });
}

export function useUpdateDeliveryTarget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: Partial<Pick<CreateDeliveryTargetRequest, 'availabilityState' | 'healthState'>> }) =>
      updateDeliveryTarget(id, request),
    onSuccess: async (_data, { id }) => {
      await queryClient.invalidateQueries({ queryKey: deliveryTargetQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: deliveryTargetQueryKeys.detail(id) });
    },
  });
}

export function useDeleteDeliveryTarget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDeliveryTarget(id),
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({ queryKey: deliveryTargetQueryKeys.all });
      queryClient.removeQueries({ queryKey: deliveryTargetQueryKeys.detail(id) });
    },
  });
}
