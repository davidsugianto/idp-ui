import api from './api';
import { API_PATHS } from '@/constants/api';
import { listEnvironments } from '@/services/environments';
import type { DashboardCostSummary, DashboardRecommendation, DashboardSummary } from '@/types/dashboard';

interface DashboardResponse {
  environment_count?: number;
  active_count?: number;
  creating_count?: number;
  alert_count?: number;
  recent_environments?: unknown[];
  cost_summary?: {
    monthly_total?: number;
    currency?: string;
    label?: string;
  } | null;
  recommendations?: Array<{
    id?: string;
    title?: string;
    description?: string;
    impact?: string;
  }>;
}

function toCostSummary(payload?: DashboardResponse['cost_summary']): DashboardCostSummary | null {
  if (!payload || typeof payload.monthly_total !== 'number') {
    return null;
  }

  return {
    monthlyTotal: payload.monthly_total,
    currency: payload.currency,
    label: payload.label,
  };
}

function toRecommendations(payload?: DashboardResponse['recommendations']): DashboardRecommendation[] {
  if (!payload?.length) {
    return [];
  }

  return payload
    .filter((item): item is NonNullable<DashboardResponse['recommendations']>[number] => Boolean(item?.title))
    .map((item, index) => ({
      id: item.id || `recommendation-${index}`,
      title: item.title || 'Recommendation',
      description: item.description,
      impact: item.impact,
    }));
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const environments = await listEnvironments();
  const fallbackSummary: DashboardSummary = {
    environmentCount: environments.length,
    activeCount: environments.filter((environment) => environment.status === 'active').length,
    creatingCount: environments.filter((environment) => environment.status === 'creating').length,
    alertCount: environments.filter((environment) => environment.status === 'error').length,
    recentEnvironments: [...environments]
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
      .slice(0, 5),
    costSummary: null,
    recommendations: [],
    hasPartialData: true,
  };

  try {
    const response = await api.get<DashboardResponse | { data?: DashboardResponse }>(API_PATHS.DASHBOARD);
    const payload = response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data
      ? response.data.data
      : (response.data as DashboardResponse);

    return {
      environmentCount:
        typeof payload.environment_count === 'number' ? payload.environment_count : fallbackSummary.environmentCount,
      activeCount: typeof payload.active_count === 'number' ? payload.active_count : fallbackSummary.activeCount,
      creatingCount:
        typeof payload.creating_count === 'number' ? payload.creating_count : fallbackSummary.creatingCount,
      alertCount: typeof payload.alert_count === 'number' ? payload.alert_count : fallbackSummary.alertCount,
      recentEnvironments:
        Array.isArray(payload.recent_environments) && payload.recent_environments.length
          ? fallbackSummary.recentEnvironments
          : fallbackSummary.recentEnvironments,
      costSummary: toCostSummary(payload.cost_summary),
      recommendations: toRecommendations(payload.recommendations),
      hasPartialData: false,
    };
  } catch {
    return fallbackSummary;
  }
}
