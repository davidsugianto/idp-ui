import { z } from 'zod';

export type EnvironmentStatus = 'active' | 'inactive' | 'creating' | 'deleting' | 'error';

const environmentNamePattern = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;

function optionalTrimmedString(schema?: z.ZodType<string>) {
  return z.preprocess(
    (value) => {
      if (typeof value !== 'string') {
        return value;
      }

      const trimmed = value.trim();
      return trimmed === '' ? undefined : trimmed;
    },
    (schema ?? z.string()).optional(),
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
  templateVersionId: optionalTrimmedString(),
  templateInputs: z.record(z.string().trim().min(1), z.string().trim().min(1)).optional(),
  deliveryTargetId: optionalTrimmedString(),
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
  labels?: Record<string, string>;
  ownerId?: string;
  expiresAt?: string | null;
  lastSyncAt?: string | null;
  lastError?: string;
  errorCount: number;
  createdAt: string;
  updatedAt: string;
  templateVersionId?: string;
  templateVersionLabel?: string;
  templateInputs?: Record<string, string>;
  deliveryTargetId?: string;
  deliveryTargetName?: string;
}

export interface TemplateSummary {
  id: string;
  name: string;
  description?: string;
  category?: string;
  author?: string;
  authorEmail?: string;
  visibility?: string;
  teamId?: string;
  latestVersion?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplateParameter {
  name: string;
  displayName: string;
  type: string;
  required: boolean;
  validation?: { pattern?: string; min?: number; max?: number };
  defaultValue?: string;
}

export interface TemplateResource {
  kind: string;
  name: string;
  spec: Record<string, string>;
}

export interface TemplateVersion {
  id: string;
  templateId: string;
  version: string;
  description?: string;
  isLatest?: boolean;
  isStable?: boolean;
  status?: string;
  parameters?: TemplateParameter[];
  resources?: TemplateResource[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DeliveryTarget {
  id: string;
  name: string;
  displayName: string;
  purpose?: string;
  availabilityState: string;
  healthState?: string;
  clusterName?: string;
  clusterServer?: string;
  capacitySummary?: {
    cpuAvailable?: string;
    memoryAvailable?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEnvironmentError {
  kind: 'validation' | 'unauthorized' | 'forbidden' | 'not_found' | 'conflict' | 'unavailable' | 'unknown';
  message: string;
  fieldErrors?: Record<string, string>;
  retryable: boolean;
  accessRelated: boolean;
}

export const createTemplateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: optionalTrimmedString(z.string().max(500, 'Description must be 500 characters or fewer')),
  category: optionalTrimmedString(),
  author: optionalTrimmedString(),
  authorEmail: optionalTrimmedString(z.string().email('Enter a valid email')),
  visibility: z.enum(['public', 'team']),
  teamId: optionalTrimmedString(),
}).refine(
  (data) => data.visibility !== 'team' || (data.visibility === 'team' && data.teamId),
  { message: 'Team ID is required when visibility is set to team', path: ['teamId'] },
);

export type CreateTemplateRequest = z.infer<typeof createTemplateSchema>;

export const createTemplateVersionSchema = z.object({
  version: z.string().trim().min(1, 'Version is required'),
  description: optionalTrimmedString(),
  isLatest: z.boolean(),
  isStable: z.boolean(),
  status: z.enum(['draft', 'stable', 'deprecated']),
});

export type CreateTemplateVersionRequest = z.infer<typeof createTemplateVersionSchema>;

export const createDeliveryTargetSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  displayName: z.string().trim().min(1, 'Display name is required'),
  purpose: z.enum(['dev', 'staging', 'production', 'dr']),
  clusterName: z.string().trim().min(1, 'Cluster name is required'),
  clusterServer: optionalTrimmedString(),
  availabilityState: z.enum(['available', 'unavailable', 'maintenance']),
  healthState: z.enum(['healthy', 'degraded', 'unhealthy']),
});

export type CreateDeliveryTargetRequest = z.infer<typeof createDeliveryTargetSchema>;

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
