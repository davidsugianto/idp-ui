import type { Environment } from '@/types/environment';

export interface DashboardCostSummary {
  monthlyTotal: number;
  currency?: string;
  label?: string;
}

export interface DashboardRecommendation {
  id: string;
  title: string;
  description?: string;
  impact?: string;
}

export interface DashboardSummary {
  environmentCount: number;
  activeCount: number;
  creatingCount: number;
  alertCount: number;
  recentEnvironments: Environment[];
  costSummary: DashboardCostSummary | null;
  recommendations: DashboardRecommendation[];
  hasPartialData: boolean;
}
