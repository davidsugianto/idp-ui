import api from './api';
import { API_PATHS } from '@/constants/api';
import type {
  CreateEnvironmentRequest,
  Environment,
  EnvironmentListQuery,
  EnvironmentStatus,
  WorkloadStatusResponse,
} from '@/types/environment';

interface EnvironmentApiResponse {
  id: string;
  team_id: string;
  name: string;
  description?: string;
  namespace: string;
  status: string;
  git_repo_url: string;
  git_revision: string;
  manifest_path: string;
  argo_app_name?: string;
  cluster_name?: string;
  cluster_server?: string;
  resource_quota_cpu?: string;
  resource_quota_memory?: string;
  labels?: Record<string, string>;
  owner_id?: string;
  expires_at?: string | null;
  last_sync_at?: string | null;
  last_error?: string;
  error_count?: number;
  created_at: string;
  updated_at: string;
}

interface WorkloadApiResponse {
  name: string;
  kind: string;
  status: string;
  desired_replicas: number;
  ready_replicas: number;
  image: string;
}

interface WorkloadStatusApiResponse {
  environment_id: string;
  namespace: string;
  summary: {
    total_workloads: number;
    healthy_workloads: number;
    degraded_workloads: number;
    total_pods: number;
    running_pods: number;
    pending_pods: number;
    failed_pods: number;
  };
  workloads: WorkloadApiResponse[];
}

function unwrapResponseData<T>(payload: T | { data?: T }): T {
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data) {
    return payload.data;
  }

  return payload as T;
}

function normalizeEnvironmentStatus(status: string): EnvironmentStatus {
  switch (status) {
    case 'ready':
      return 'active';
    case 'failed':
      return 'error';
    default:
      return status as EnvironmentStatus;
  }
}

function normalizeEnvironment(payload: EnvironmentApiResponse): Environment {
  return {
    id: payload.id,
    teamId: payload.team_id,
    name: payload.name,
    description: payload.description,
    namespace: payload.namespace,
    status: normalizeEnvironmentStatus(payload.status),
    gitRepoUrl: payload.git_repo_url,
    gitRevision: payload.git_revision,
    manifestPath: payload.manifest_path,
    argoAppName: payload.argo_app_name,
    clusterName: payload.cluster_name || '',
    clusterServer: payload.cluster_server,
    resourceQuotaCpu: payload.resource_quota_cpu,
    resourceQuotaMemory: payload.resource_quota_memory,
    labels: payload.labels,
    ownerId: payload.owner_id,
    expiresAt: payload.expires_at,
    lastSyncAt: payload.last_sync_at,
    lastError: payload.last_error,
    errorCount: payload.error_count ?? 0,
    createdAt: payload.created_at,
    updatedAt: payload.updated_at,
  };
}

function normalizeWorkloadStatus(payload: WorkloadStatusApiResponse): WorkloadStatusResponse {
  return {
    environmentId: payload.environment_id,
    namespace: payload.namespace,
    summary: {
      totalWorkloads: payload.summary.total_workloads,
      healthyWorkloads: payload.summary.healthy_workloads,
      degradedWorkloads: payload.summary.degraded_workloads,
      totalPods: payload.summary.total_pods,
      runningPods: payload.summary.running_pods,
      pendingPods: payload.summary.pending_pods,
      failedPods: payload.summary.failed_pods,
    },
    workloads: payload.workloads.map((workload) => ({
      name: workload.name,
      kind: workload.kind,
      status: workload.status,
      desiredReplicas: workload.desired_replicas,
      readyReplicas: workload.ready_replicas,
      image: workload.image,
    })),
  };
}

function compactObject<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T;
}

function toCreateEnvironmentPayload(request: CreateEnvironmentRequest) {
  return compactObject({
    name: request.name,
    description: request.description,
    git_repo_url: request.gitRepoUrl,
    manifest_path: request.manifestPath,
    git_revision: request.gitRevision,
    cluster_name: request.clusterName,
    resource_quota_cpu: request.resourceQuotaCpu,
    resource_quota_memory: request.resourceQuotaMemory,
    labels: request.labels,
    expires_at: request.expiresAt,
  });
}

export async function listEnvironments(_query?: EnvironmentListQuery): Promise<Environment[]> {
  const res = await api.get<EnvironmentApiResponse[] | { data?: EnvironmentApiResponse[] }>(API_PATHS.ENVIRONMENTS);
  const payload = unwrapResponseData<EnvironmentApiResponse[]>(res.data);
  return payload.map(normalizeEnvironment);
}

export async function getEnvironment(id: string): Promise<Environment> {
  const res = await api.get<EnvironmentApiResponse | { data?: EnvironmentApiResponse }>(API_PATHS.ENVIRONMENT(id));
  return normalizeEnvironment(unwrapResponseData<EnvironmentApiResponse>(res.data));
}

export async function createEnvironment(request: CreateEnvironmentRequest): Promise<Environment> {
  const res = await api.post<EnvironmentApiResponse | { data?: EnvironmentApiResponse }>(
    API_PATHS.ENVIRONMENTS,
    toCreateEnvironmentPayload(request),
  );
  return normalizeEnvironment(unwrapResponseData<EnvironmentApiResponse>(res.data));
}

export async function deleteEnvironment(id: string) {
  await api.delete(API_PATHS.ENVIRONMENT(id));
}

export async function syncEnvironment(id: string) {
  await api.post(API_PATHS.ENVIRONMENT_SYNC(id));
}

export async function getEnvironmentWorkloads(id: string): Promise<WorkloadStatusResponse> {
  const res = await api.get<WorkloadStatusApiResponse | { data?: WorkloadStatusApiResponse }>(API_PATHS.ENVIRONMENT_WORKLOADS(id));
  return normalizeWorkloadStatus(unwrapResponseData<WorkloadStatusApiResponse>(res.data));
}
