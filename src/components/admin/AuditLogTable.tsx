import { Space, Table, Tag, Typography } from 'antd';
import type { AuditLogRecord } from '@/types/admin';

const { Text } = Typography;

interface AuditLogTableProps {
  records: AuditLogRecord[];
  loading?: boolean;
}

function getOutcomeColor(outcome: string) {
  if (outcome === 'success') return 'green';
  if (outcome === 'warning') return 'gold';
  return 'red';
}

function AuditLogTable({ records, loading = false }: AuditLogTableProps) {
  return (
    <Table<AuditLogRecord>
      rowKey="id"
      loading={loading}
      pagination={false}
      size="middle"
      scroll={{ x: 920 }}
      dataSource={records}
      locale={{
        emptyText: <Text type="secondary">No audit events match the current view.</Text>,
      }}
      columns={[
        {
          title: 'Actor',
          dataIndex: 'actor',
          key: 'actor',
          width: 220,
          render: (actor: string) => <Text strong>{actor}</Text>,
        },
        {
          title: 'Activity',
          key: 'activity',
          render: (_value, record) => (
            <Space direction="vertical" size={2}>
              <Text strong>{record.action}</Text>
              <Text type="secondary">{record.resource}</Text>
            </Space>
          ),
        },
        {
          title: 'Outcome',
          dataIndex: 'outcome',
          key: 'outcome',
          width: 150,
          render: (value: string) => <Tag color={getOutcomeColor(value)}>{value.toUpperCase()}</Tag>,
        },
        {
          title: 'Timestamp',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: 220,
          render: (value: string) => (value ? new Date(value).toLocaleString() : '—'),
        },
      ]}
    />
  );
}

export default AuditLogTable;
