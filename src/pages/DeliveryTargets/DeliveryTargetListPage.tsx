import { useNavigate } from 'react-router-dom';
import { Alert, Button, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '@/components/common/PageHeader';
import SectionCard from '@/components/common/SectionCard';
import { useDeliveryTargets } from '@/hooks/useEnvironments';
import { useAuthStore } from '@/stores/authStore';
import type { DeliveryTarget } from '@/types/environment';

const availabilityColor: Record<string, string> = {
  available: 'green',
  unavailable: 'red',
  maintenance: 'orange',
};

const healthColor: Record<string, string> = {
  healthy: 'green',
  degraded: 'orange',
  unhealthy: 'red',
};

const columns: ColumnsType<DeliveryTarget> = [
  {
    title: 'Display Name',
    dataIndex: 'displayName',
    key: 'displayName',
    sorter: (a, b) => a.displayName.localeCompare(b.displayName),
  },
  {
    title: 'Purpose',
    dataIndex: 'purpose',
    key: 'purpose',
    render: (p?: string) => <Tag>{p || '—'}</Tag>,
  },
  {
    title: 'Cluster',
    dataIndex: 'clusterName',
    key: 'clusterName',
    render: (name?: string) => name || '—',
  },
  {
    title: 'Availability',
    dataIndex: 'availabilityState',
    key: 'availabilityState',
    render: (state: string) => (
      <Tag color={availabilityColor[state] || 'default'}>{state}</Tag>
    ),
  },
  {
    title: 'Health',
    dataIndex: 'healthState',
    key: 'healthState',
    render: (state?: string) => state ? (
      <Tag color={healthColor[state] || 'default'}>{state}</Tag>
    ) : '—',
  },
];

export default function DeliveryTargetListPage() {
  const navigate = useNavigate();
  const targets = useDeliveryTargets();
  const isAdmin = useAuthStore((s) => s.user?.roles.includes('admin') ?? false);

  if (targets.isLoading) {
    return (
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        <PageHeader
          eyebrow="Multi-cluster placement"
          title="Delivery targets"
          description="Browse available Kubernetes clusters for environment placement."
        />
        <SectionCard bodyStyle={{ padding: 28 }}>
          <Table<DeliveryTarget>
            columns={columns}
            dataSource={[]}
            loading
            rowKey="id"
            pagination={{ pageSize: 20, showSizeChanger: true }}
          />
        </SectionCard>
      </Space>
    );
  }

  if (targets.isError) {
    return (
      <Alert
        type="error"
        showIcon
        message="Unable to load delivery targets"
        description={(targets.error as Error)?.message || 'Please retry.'}
        action={<Button size="small" onClick={() => targets.refetch()}>Retry</Button>}
      />
    );
  }

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <PageHeader
        eyebrow="Multi-cluster placement"
        title="Delivery targets"
        description="Browse available Kubernetes clusters for environment placement. Targets marked unavailable cannot be selected for new environments."
        actions={
          isAdmin
            ? [{ key: 'create', label: <><PlusOutlined /> Register Target</>, type: 'primary', onClick: () => navigate('/admin/delivery-targets/new') }]
            : undefined
        }
      />

      <SectionCard bodyStyle={{ padding: 28 }}>
        <Table<DeliveryTarget>
          columns={columns}
          dataSource={targets.data}
          rowKey="id"
          onRow={(record) => ({
            style: { cursor: 'pointer' },
            onClick: () => navigate(`/delivery-targets/${record.id}`),
          })}
          pagination={{ pageSize: 20, showSizeChanger: true }}
          locale={{ emptyText: 'No delivery targets are registered yet. Targets are configured by platform administrators.' }}
        />
      </SectionCard>
    </Space>
  );
}