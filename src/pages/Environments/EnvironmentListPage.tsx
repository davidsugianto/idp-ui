import { Alert, Button, Flex, Space, Spin, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import FilterBar from '@/components/environments/FilterBar';
import EnvironmentCard from '@/components/environments/EnvironmentCard';
import PageHeader from '@/components/common/PageHeader';
import { useEnvironments, useSyncEnvironment } from '@/hooks/useEnvironments';
import type { EnvironmentListQuery } from '@/types/environment';

const { Text } = Typography;

function EnvironmentListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<EnvironmentListQuery>({
    search: '',
    status: 'all',
  });
  const { data, isLoading, isError, error, refetch, isFetching } = useEnvironments(filters);
  const syncMutation = useSyncEnvironment();

  const teams = useMemo(
    () => Array.from(new Set((data ?? []).map((environment) => environment.teamId))).sort(),
    [data],
  );
  const clusters = useMemo(
    () => Array.from(new Set((data ?? []).map((environment) => environment.clusterName).filter(Boolean))).sort(),
    [data],
  );

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <Flex justify="center" style={{ padding: '64px 0' }}>
          <Spin size="large" />
        </Flex>
      );
    }

    if (isError) {
      return (
        <Alert
          type="error"
          showIcon
          message="Failed to load environments"
          description={error instanceof Error ? error.message : 'Please try again.'}
          action={<Button onClick={() => void refetch()}>Retry</Button>}
        />
      );
    }

    if (!data?.length) {
      return (
        <Alert
          type="info"
          showIcon
          message="No environments found"
          description="Create your first environment or adjust your filters."
        />
      );
    }

    return (
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        {data.map((environment) => (
          <EnvironmentCard
            key={environment.id}
            environment={environment}
            onSync={(id) => syncMutation.mutate(id)}
            syncing={syncMutation.isPending && syncMutation.variables === environment.id}
          />
        ))}
      </Space>
    );
  }, [data, error, isError, isLoading, refetch, syncMutation]);

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <PageHeader
        title="Environments"
        description="Browse active environments, inspect status, and drill into workloads."
        actions={[
          {
            key: 'create',
            label: 'Create Environment',
            type: 'primary',
            onClick: () => navigate('/environments/new'),
          },
        ]}
      />

      <FilterBar value={filters} onChange={setFilters} teams={teams} clusters={clusters} />

      {syncMutation.isSuccess ? <Alert type="success" showIcon message="Synchronization requested" /> : null}
      {syncMutation.isError ? (
        <Alert
          type="error"
          showIcon
          message="Failed to trigger synchronization"
          description={syncMutation.error instanceof Error ? syncMutation.error.message : 'Please try again.'}
        />
      ) : null}
      {isFetching && !isLoading ? <Text type="secondary">Refreshing environments…</Text> : null}

      {content}
    </Space>
  );
}

export default EnvironmentListPage;
