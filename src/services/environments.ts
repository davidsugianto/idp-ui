import api from './api';
import { API_PATHS } from '@/constants/api';
import type {
  CreateEnvironmentRequest,
  CreateEnvironmentError,
  CreateTemplateRequest,
  CreateTemplateVersionRequest,
  CreateDeliveryTargetRequest,
  DeliveryTarget,
  Environment,
  EnvironmentListQuery,
  EnvironmentStatus,
  TemplateSummary,
  TemplateVersion,
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
  labels?: Record<string, string>;
  owner_id?: string;
  expires_at?: string | null;
  last_sync_at?: string | null;
  last_error?: string;
  error_count?: number;
  created_at: string;
  updated_at: string;
  template_version_id?: string;
  template_version_label?: string;
  template_inputs?: Record<string, string>;
  delivery_target_id?: string;
  delivery_target_name?: string;
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
    labels: payload.labels,
    ownerId: payload.owner_id,
    expiresAt: payload.expires_at,
    lastSyncAt: payload.last_sync_at,
    lastError: payload.last_error,
    errorCount: payload.error_count ?? 0,
    createdAt: payload.created_at,
    updatedAt: payload.updated_at,
    templateVersionId: payload.template_version_id,
    templateVersionLabel: payload.template_version_label,
    templateInputs: payload.template_inputs,
    deliveryTargetId: payload.delivery_target_id,
    deliveryTargetName: payload.delivery_target_name,
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
    template_version_id: request.templateVersionId,
    template_inputs: request.templateInputs,
    delivery_target_id: request.deliveryTargetId,
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

export function parseCreateEnvironmentError(error: unknown): CreateEnvironmentError {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;

    if (status === 400) {
      return {
        kind: 'validation',
        message: (data?.message as string) || 'Invalid input. Please check the highlighted fields and try again.',
        fieldErrors: data?.field_errors as Record<string, string> | undefined,
        retryable: true,
        accessRelated: false,
      };
    }
    if (status === 401) {
      return { kind: 'unauthorized', message: 'Your session has expired. Please sign in again.', retryable: false, accessRelated: false };
    }
    if (status === 403) {
      return { kind: 'forbidden', message: (data?.message as string) || 'You do not have permission to create environments.', retryable: false, accessRelated: true };
    }
    if (status === 404) {
      return { kind: 'not_found', message: (data?.message as string) || 'The selected template version or delivery target is no longer available.', retryable: true, accessRelated: false };
    }
    if (status === 409) {
      return { kind: 'conflict', message: (data?.message as string) || 'An environment with this name already exists.', retryable: true, accessRelated: false };
    }
    if (status && status >= 500) {
      return { kind: 'unavailable', message: 'The server is temporarily unavailable. You can retry in a moment.', retryable: true, accessRelated: false };
    }
  }

  if (error instanceof Error) {
    return { kind: 'unknown', message: error.message, retryable: true, accessRelated: false };
  }

  return { kind: 'unknown', message: 'An unexpected error occurred.', retryable: true, accessRelated: false };
}

interface TemplateApiResponse {
  id: string;
  name: string;
  description?: string;
  category?: string;
  author?: string;
  author_email?: string;
  visibility?: string;
  team_id?: string;
  latest_version?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface TemplateVersionApiResponse {
  id: string;
  template_id: string;
  version: string;
  description?: string;
  is_latest?: boolean;
  is_stable?: boolean;
  status?: string;
  parameters?: Array<{
    name: string;
    display_name: string;
    type: string;
    required: boolean;
    validation?: { pattern?: string; min?: number; max?: number };
    default_value?: string;
  }>;
  resources?: Array<{
    kind: string;
    name: string;
    spec: Record<string, string>;
  }>;
  created_at?: string;
  updated_at?: string;
}

interface DeliveryTargetApiResponse {
  id: string;
  name: string;
  display_name: string;
  purpose?: string;
  availability_state: string;
  health_state?: string;
  cluster_name?: string;
  cluster_server?: string;
  capacity_summary?: {
    cpu_available?: string;
    memory_available?: string;
  };
  created_at?: string;
  updated_at?: string;
}

function normalizeTemplate(payload: TemplateApiResponse): TemplateSummary {
  return {
    id: payload.id,
    name: payload.name,
    description: payload.description,
    category: payload.category,
    author: payload.author,
    authorEmail: payload.author_email,
    visibility: payload.visibility,
    teamId: payload.team_id,
    latestVersion: payload.latest_version,
    status: payload.status,
    createdAt: payload.created_at,
    updatedAt: payload.updated_at,
  };
}

function normalizeTemplateVersion(payload: TemplateVersionApiResponse): TemplateVersion {
  return {
    id: payload.id,
    templateId: payload.template_id,
    version: payload.version,
    description: payload.description,
    isLatest: payload.is_latest,
    isStable: payload.is_stable,
    status: payload.status,
    parameters: payload.parameters?.map((p) => ({
      name: p.name,
      displayName: p.display_name,
      type: p.type,
      required: p.required,
      validation: p.validation,
      defaultValue: p.default_value,
    })),
    resources: payload.resources?.map((r) => ({
      kind: r.kind,
      name: r.name,
      spec: r.spec,
    })),
    createdAt: payload.created_at,
    updatedAt: payload.updated_at,
  };
}

function normalizeDeliveryTarget(payload: DeliveryTargetApiResponse): DeliveryTarget {
  return {
    id: payload.id,
    name: payload.name,
    displayName: payload.display_name,
    purpose: payload.purpose,
    availabilityState: payload.availability_state,
    healthState: payload.health_state,
    clusterName: payload.cluster_name,
    clusterServer: payload.cluster_server,
    capacitySummary: payload.capacity_summary && {
      cpuAvailable: payload.capacity_summary.cpu_available,
      memoryAvailable: payload.capacity_summary.memory_available,
    },
    createdAt: payload.created_at,
    updatedAt: payload.updated_at,
  };
}

function unwrapListResponse<T>(payload: unknown, arrayKey: string): T[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    // Try the expected key first, then common alternatives
    const keys = [arrayKey, 'items', 'results', 'data'];
    for (const key of keys) {
      const value = (payload as Record<string, unknown>)[key];
      if (Array.isArray(value)) return value as T[];
    }
  }
  return [];
}

export async function listTemplates(): Promise<TemplateSummary[]> {
  const res = await api.get<TemplateApiResponse[] | { data?: TemplateApiResponse[] }>(API_PATHS.TEMPLATES);
  const payload = unwrapResponseData<TemplateApiResponse[]>(res.data);
  const items = unwrapListResponse<TemplateApiResponse>(payload, 'templates');
  return items.map(normalizeTemplate);
}

export async function getTemplate(id: string): Promise<TemplateSummary> {
  const res = await api.get<TemplateApiResponse | { data?: TemplateApiResponse }>(API_PATHS.TEMPLATE(id));
  return normalizeTemplate(unwrapResponseData<TemplateApiResponse>(res.data));
}

export async function listTemplateVersions(templateId: string): Promise<TemplateVersion[]> {
  const res = await api.get<TemplateVersionApiResponse[] | { data?: TemplateVersionApiResponse[] }>(API_PATHS.TEMPLATE_VERSIONS(templateId));
  const payload = unwrapResponseData<TemplateVersionApiResponse[]>(res.data);
  const items = unwrapListResponse<TemplateVersionApiResponse>(payload, 'versions');
  return items.map(normalizeTemplateVersion);
}

export async function getTemplateVersion(templateId: string, versionId: string): Promise<TemplateVersion> {
  const res = await api.get<TemplateVersionApiResponse | { data?: TemplateVersionApiResponse }>(API_PATHS.TEMPLATE_VERSION(templateId, versionId));
  return normalizeTemplateVersion(unwrapResponseData<TemplateVersionApiResponse>(res.data));
}

export async function listDeliveryTargets(): Promise<DeliveryTarget[]> {
  const res = await api.get<DeliveryTargetApiResponse[] | { data?: DeliveryTargetApiResponse[] }>(API_PATHS.DELIVERY_TARGETS);
  const payload = unwrapResponseData<DeliveryTargetApiResponse[]>(res.data);
  const items = unwrapListResponse<DeliveryTargetApiResponse>(payload, 'targets');
  return items.map(normalizeDeliveryTarget);
}

export async function getDeliveryTarget(id: string): Promise<DeliveryTarget> {
  const res = await api.get<DeliveryTargetApiResponse | { data?: DeliveryTargetApiResponse }>(API_PATHS.DELIVERY_TARGET(id));
  return normalizeDeliveryTarget(unwrapResponseData<DeliveryTargetApiResponse>(res.data));
}

export async function createTemplate(request: CreateTemplateRequest): Promise<TemplateSummary> {
  const payload: Record<string, unknown> = {
    name: request.name,
    description: request.description,
    category: request.category,
    author: request.author,
    author_email: request.authorEmail,
    visibility: request.visibility,
  };
  if (request.teamId) {
    payload.team_id = request.teamId;
  }
  const res = await api.post<TemplateApiResponse | { data?: TemplateApiResponse }>(API_PATHS.TEMPLATES, payload);
  return normalizeTemplate(unwrapResponseData<TemplateApiResponse>(res.data));
}

export async function deleteTemplate(id: string): Promise<void> {
  await api.delete(API_PATHS.TEMPLATE(id));
}

export async function createTemplateVersion(
  templateId: string,
  request: CreateTemplateVersionRequest,
): Promise<TemplateVersion> {
  const res = await api.post<TemplateVersionApiResponse | { data?: TemplateVersionApiResponse }>(
    API_PATHS.TEMPLATE_VERSIONS(templateId),
    {
      version: request.version,
      description: request.description,
      is_latest: request.isLatest,
      is_stable: request.isStable,
      status: request.status,
    },
  );
  return normalizeTemplateVersion(unwrapResponseData<TemplateVersionApiResponse>(res.data));
}

export async function createDeliveryTarget(request: CreateDeliveryTargetRequest): Promise<DeliveryTarget> {
  const res = await api.post<DeliveryTargetApiResponse | { data?: DeliveryTargetApiResponse }>(
    API_PATHS.DELIVERY_TARGETS,
    {
      name: request.name,
      display_name: request.displayName,
      purpose: request.purpose,
      cluster_name: request.clusterName,
      cluster_server: request.clusterServer,
      availability_state: request.availabilityState,
      health_state: request.healthState,
    },
  );
  return normalizeDeliveryTarget(unwrapResponseData<DeliveryTargetApiResponse>(res.data));
}

export async function updateDeliveryTarget(
  id: string,
  request: Partial<Pick<CreateDeliveryTargetRequest, 'availabilityState' | 'healthState'>>,
): Promise<DeliveryTarget> {
  const payload: Record<string, unknown> = {};
  if (request.availabilityState) {
    payload.availability_state = request.availabilityState;
  }
  if (request.healthState) {
    payload.health_state = request.healthState;
  }
  const res = await api.patch<DeliveryTargetApiResponse | { data?: DeliveryTargetApiResponse }>(
    API_PATHS.DELIVERY_TARGET(id),
    payload,
  );
  return normalizeDeliveryTarget(unwrapResponseData<DeliveryTargetApiResponse>(res.data));
}

export async function deleteDeliveryTarget(id: string): Promise<void> {
  await api.delete(API_PATHS.DELIVERY_TARGET(id));
}
