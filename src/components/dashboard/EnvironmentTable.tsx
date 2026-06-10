import { Tag, Typography, Button, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import SectionCard from '@/components/common/SectionCard';
import type { Environment } from '@/types/environment';

const { Text } = Typography;

const statusColors: Record<Environment['status'], string> = {
  active: 'green',
  inactive: 'default',
  creating: 'blue',
  deleting: 'orange',
  error: 'red',
};

interface EnvironmentTableProps {
  environments: Environment[];
  loading?: boolean;
}

const columns: ColumnsType<Environment> = [
  {
    title: 'Environment',
    dataIndex: 'name',
    key: 'name',
    render: (name: string, record: Environment) => (
      <a href={`/environments/${record.id}`} style={{ color: '#1677ff' }}>
        {name}
      </a>
    ),
  },
  {
    title: 'Namespace',
    dataIndex: 'namespace',
    key: 'namespace',
    render: (ns: string) => <Text type="secondary">{ns}</Text>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: Environment['status']) => (
      <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
    ),
  },
  {
    title: 'Cluster',
    dataIndex: 'clusterName',
    key: 'clusterName',
    render: (name: string) => <Text type="secondary">{name || '—'}</Text>,
  },
  {
    title: 'Updated',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (d: string) => <Text type="secondary">{new Date(d).toLocaleString()}</Text>,
  },
];

function EnvironmentTable({ environments, loading = false }: EnvironmentTableProps) {
  const navigate = useNavigate();
  const preview = environments.slice(0, 5);

  return (
    <SectionCard
      title="Recent environments"
      description="Track the latest active workspaces, scan status quickly, and jump straight into operational details."
      extra={
        <Button type="default" onClick={() => navigate('/environments')}>
          View all
        </Button>
      }
      style={{ height: '100%' }}
    >
      <Table
        columns={columns}
        dataSource={preview}
        rowKey="id"
        loading={loading}
        pagination={false}
        size="middle"
        onRow={(record) => ({
          onClick: () => navigate(`/environments/${record.id}`),
          style: { cursor: 'pointer' },
        })}
        locale={{ emptyText: 'No recent environments.' }}
      />
    </SectionCard>
  );
}

export default EnvironmentTable;