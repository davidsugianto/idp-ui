import { Alert, Button, Space, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import AsyncState from '@/components/common/AsyncState';
import PageHeader from '@/components/common/PageHeader';
import SectionCard from '@/components/common/SectionCard';
import EnvironmentInfo from '@/components/environments/EnvironmentInfo';
import WorkloadTable from '@/components/environments/WorkloadTable';
import { useEnvironment, useEnvironmentWorkloads, useSyncEnvironment } from '@/hooks/useEnvironments';

const { Text } = Typography;

function EnvironmentDetailPage() {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const environmentQuery = useEnvironment(id);
  const workloadQuery = useEnvironmentWorkloads(id);
  const syncMutation = useSyncEnvironment();

  if (environmentQuery.isError || !environmentQuery.data) {
    return (
      <AsyncState
        error={environmentQuery.error instanceof Error ? environmentQuery.error : new Error('Failed to load environment')}
        onRetry={() => void environmentQuery.refetch()}
      >
        {null}
      </AsyncState>
    );
  }

  return (
    <AsyncState isLoading={environmentQuery.isLoading}>
      {environmentQuery.data ? (
        <EnvironmentDetailContent
          environment={environmentQuery.data}
          isRefreshingEnvironment={environmentQuery.isFetching && !environmentQuery.isLoading}
          onBack={() => navigate('/environments')}
          onRetryEnvironment={() => void environmentQuery.refetch()}
          workloadQuery={workloadQuery}
          syncMutation={syncMutation}
        />
      ) : null}
    </AsyncState>
  );
}

interface EnvironmentDetailContentProps {
  environment: NonNullable<ReturnType<typeof useEnvironment>['data']>;
  isRefreshingEnvironment: boolean;
  onBack: () => void;
  onRetryEnvironment: () => void;
  workloadQuery: ReturnType<typeof useEnvironmentWorkloads>;
  syncMutation: ReturnType<typeof useSyncEnvironment>;
}

function EnvironmentDetailContent({
  environment,
  isRefreshingEnvironment,
  onBack,
  onRetryEnvironment,
  workloadQuery,
  syncMutation,
}: EnvironmentDetailContentProps) {
  const workloads = workloadQuery.data?.workloads ?? [];
  const summary = workloadQuery.data?.summary;

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <PageHeader
        title={environment.name}
        description="Environment details, GitOps metadata, and live workload status."
        actions={[
          {
            key: 'back',
            label: 'Back',
            onClick: onBack,
          },
          {
            key: 'sync',
            label: 'Sync',
            type: 'primary',
            loading: syncMutation.isPending,
            onClick: () => syncMutation.mutate(environment.id),
          },
        ]}
      />

      {isRefreshingEnvironment ? <Alert type="info" showIcon message="Refreshing environment details" /> : null}
      {syncMutation.isSuccess ? <Alert type="success" showIcon message="Synchronization requested" /> : null}
      {syncMutation.isError ? (
        <Alert
          type="error"
          showIcon
          message="Failed to trigger sync"
          description={syncMutation.error instanceof Error ? syncMutation.error.message : 'Please try again.'}
        />
      ) : null}

      <SectionCard title="Overview" extra={<Button onClick={onRetryEnvironment}>Refresh</Button>}>
        <EnvironmentInfo environment={environment} />
      </SectionCard>

      <SectionCard
        title="Workloads"
        extra={
          summary ? (
            <Text type="secondary">
              {summary.healthyWorkloads}/{summary.totalWorkloads} healthy workloads · {summary.runningPods}/{summary.totalPods} pods running
            </Text>
          ) : null
        }
      >
        {workloadQuery.isError ? (
          <Alert
            type="error"
            showIcon
            message="Failed to load workloads"
            description={workloadQuery.error instanceof Error ? workloadQuery.error.message : 'Please try again.'}
            action={<Button onClick={() => void workloadQuery.refetch()}>Retry</Button>}
          />
        ) : (
          <WorkloadTable workloads={workloads} loading={workloadQuery.isLoading} summary={summary} />
        )}
      </SectionCard>
    </Space>
  );
}

export default EnvironmentDetailPage;
