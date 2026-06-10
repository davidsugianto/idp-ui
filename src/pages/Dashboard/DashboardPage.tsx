import { useMemo, useState } from 'react';
import { Alert, Col, Row, Space, Tabs, Typography, theme } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageHeader from '@/components/common/PageHeader';
import SectionCard from '@/components/common/SectionCard';
import EnvironmentTable from '@/components/dashboard/EnvironmentTable';
import RecommendationList from '@/components/dashboard/RecommendationList';
import StatCard from '@/components/dashboard/StatCard';
import { useDashboard } from '@/hooks/useDashboard';

const { Text } = Typography;

const chartData = [
  { month: 'Jan', value: 28 },
  { month: 'Feb', value: 42 },
  { month: 'Mar', value: 35 },
  { month: 'Apr', value: 58 },
  { month: 'May', value: 47 },
  { month: 'Jun', value: 63 },
  { month: 'Jul', value: 52 },
  { month: 'Aug', value: 71 },
  { month: 'Sep', value: 48 },
  { month: 'Oct', value: 55 },
  { month: 'Nov', value: 38 },
  { month: 'Dec', value: 44 },
];

function DashboardPage() {
  const { token } = theme.useToken();
  const dashboardQuery = useDashboard();
  const dashboard = dashboardQuery.data;
  const [chartTab, setChartTab] = useState('activity');

  const chartTabItems = [
    { key: 'activity', label: 'Activity' },
    { key: 'deployments', label: 'Deployments' },
  ];

  const rankingItems = useMemo(() => {
    const envs = dashboard?.recentEnvironments ?? [];
    return envs.slice(0, 7).map((env, i) => ({
      rank: i + 1,
      name: env.name,
      status: env.status,
    }));
  }, [dashboard?.recentEnvironments]);

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <PageHeader
        eyebrow="Overview"
        title="Operations dashboard"
        description="Track environment health, activity, and the latest operational recommendations from one workspace."
      />

      {dashboardQuery.isError ? (
        <Alert
          type="error"
          showIcon
          message="Failed to load dashboard data"
          description={dashboardQuery.error instanceof Error ? dashboardQuery.error.message : 'Please try again.'}
        />
      ) : null}

      {dashboard?.hasPartialData ? (
        <Alert
          type="warning"
          showIcon
          message="Dashboard data is partially available"
          description="Core environment data is up to date, but cost or recommendation data is temporarily unavailable."
        />
      ) : null}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Total environments"
            value={dashboard?.environmentCount ?? 0}
            loading={dashboardQuery.isLoading}
            change={12}
            changeLabel="vs last month"
            footer="Active workspace count across all clusters"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Visits"
            value={dashboard?.activeCount ?? 0}
            loading={dashboardQuery.isLoading}
            change={-5}
            changeLabel="vs last week"
            footer="Unique environment visits in 24h"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Deployments"
            value={dashboard?.creatingCount ?? 0}
            loading={dashboardQuery.isLoading}
            change={8}
            changeLabel="vs last month"
            footer="Environments currently provisioning"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Activity rate"
            value={dashboard?.alertCount ?? 0}
            suffix="%"
            loading={dashboardQuery.isLoading}
            change={3}
            changeLabel="vs last week"
            footer="Operational signals within threshold"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <SectionCard
            title={chartTab === 'activity' ? 'Environment activity' : 'Deployment trends'}
            description="Monthly breakdown of operational activity across the platform."
            extra={
              <Tabs
                activeKey={chartTab}
                onChange={setChartTab}
                items={chartTabItems}
                size="small"
                style={{ marginBottom: 0 }}
              />
            }
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke={token.colorBorderSecondary} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: token.colorTextSecondary }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: token.colorTextSecondary }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: `1px solid ${token.colorBorderSecondary}` }}
                />
                <Bar dataKey="value" fill={token.colorPrimary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </Col>
        <Col xs={24} xl={8}>
          <SectionCard
            title="Environment ranking"
            description="Top environments by recent activity."
          >
            {rankingItems.length ? (
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                {rankingItems.map((item) => (
                  <div key={item.rank} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        background: item.rank <= 3 ? token.colorPrimary : token.colorBorderSecondary,
                        color: item.rank <= 3 ? '#fff' : token.colorTextSecondary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {item.rank}
                    </div>
                    <Text ellipsis style={{ flex: 1, minWidth: 0 }}>
                      {item.name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12, flexShrink: 0 }}>
                      {item.status}
                    </Text>
                  </div>
                ))}
              </Space>
            ) : (
              <Text type="secondary">No environment data available.</Text>
            )}
          </SectionCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <EnvironmentTable environments={dashboard?.recentEnvironments ?? []} loading={dashboardQuery.isLoading} />
        </Col>
        <Col xs={24} xl={8}>
          <RecommendationList recommendations={dashboard?.recommendations ?? []} loading={dashboardQuery.isLoading} />
        </Col>
      </Row>
    </Space>
  );
}

export default DashboardPage;