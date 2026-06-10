import { z } from 'zod';

export type EnvironmentStatus = 'active' | 'inactive' | 'creating' | 'deleting' | 'error';

const environmentNamePattern = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
const resourceQuotaPattern = /^[0-9]+(?:m|Mi|Gi|Ti)?$/;

function optionalTrimmedString(schema?: z.ZodType<string>) {
  return z.preprocess(
    (value) => {
      if (typeof value !== 'string') {
        return value;
      }

      const trimmed = value.trim();
      return trimmed === '' ? undefined : trimmed;
    },
    schema ?? z.string(),
  ) as z.ZodType<string | undefined>;
}

export const createEnvironmentRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .regex(environmentNamePattern, 'Use lowercase letters, numbers, and hyphens only'),
  description: optionalTrimmedString(z.string().max(280, 'Description must be 280 characters or fewer')),
  gitRepoUrl: z.string().trim().url('Enter a valid git repository URL'),
  manifestPath: z.string().trim().min(1, 'Manifest path is required'),
  gitRevision: z.string().trim().min(1, 'Git revision is required'),
  clusterName: optionalTrimmedString(),
  resourceQuotaCpu: optionalTrimmedString(z.string().regex(resourceQuotaPattern, 'Use values like 500m or 2')),
  resourceQuotaMemory: optionalTrimmedString(z.string().regex(resourceQuotaPattern, 'Use values like 512Mi or 2Gi')),
  labels: z.record(z.string().trim().min(1), z.string().trim().min(1)).optional(),
  expiresAt: optionalTrimmedString(z.string().datetime({ offset: true, message: 'Enter a valid expiration date and time' })),
});

export type CreateEnvironmentRequest = z.infer<typeof createEnvironmentRequestSchema>;

export interface Environment {
  id: string;
  teamId: string;
  name: string;
  description?: string;
  namespace: string;
  status: EnvironmentStatus;
  gitRepoUrl: string;
  gitRevision: string;
  manifestPath: string;
  argoAppName?: string;
  clusterName: string;
  clusterServer?: string;
  resourceQuotaCpu?: string;
  resourceQuotaMemory?: string;
  labels?: Record<string, string>;
  ownerId?: string;
  expiresAt?: string | null;
  lastSyncAt?: string | null;
  lastError?: string;
  errorCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EnvironmentListQuery {
  search?: string;
  status?: EnvironmentStatus | 'all';
  team?: string;
  cluster?: string;
}

export interface WorkloadSummary {
  totalWorkloads: number;
  healthyWorkloads: number;
  degradedWorkloads: number;
  totalPods: number;
  runningPods: number;
  pendingPods: number;
  failedPods: number;
}

export interface Workload {
  name: string;
  kind: string;
  status: string;
  desiredReplicas: number;
  readyReplicas: number;
  image: string;
}

export interface WorkloadStatusResponse {
  environmentId: string;
  namespace: string;
  summary: WorkloadSummary;
  workloads: Workload[];
}
