import { Button, Card, Space, Table, Tag, Typography } from 'antd';
import type { ApiKeyRecord } from '@/types/apiKey';

const { Text, Title } = Typography;

interface APIKeyListProps {
  apiKeys: ApiKeyRecord[];
  loading?: boolean;
  revokingId?: string;
  onCreate: () => void;
  onRevoke: (id: string) => void;
}

function APIKeyList({ apiKeys, loading = false, revokingId, onCreate, onRevoke }: APIKeyListProps) {
  return (
    <Card bodyStyle={{ padding: 0 }} style={{ boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)' }}>
      <div style={{ padding: '24px 24px 14px' }}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }} wrap>
            <Space direction="vertical" size={4}>
              <Title level={4}>Credentials</Title>
              <Text type="secondary">Create or revoke API keys used by CI/CD and other automation workflows.</Text>
            </Space>
            <Button type="primary" onClick={onCreate}>
              Create API Key
            </Button>
          </Space>
        </Space>
      </div>
      <Table<ApiKeyRecord>
        rowKey="id"
        loading={loading}
        pagination={false}
        size="middle"
        scroll={{ x: 980 }}
        dataSource={apiKeys}
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Prefix',
            dataIndex: 'prefix',
            key: 'prefix',
            render: (value: string) => value || '—',
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => <Tag color={status === 'active' ? 'green' : 'default'}>{status.toUpperCase()}</Tag>,
          },
          {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value: string) => (value ? new Date(value).toLocaleString() : '—'),
          },
          {
            title: 'Expires',
            dataIndex: 'expiresAt',
            key: 'expiresAt',
            render: (value?: string | null) => (value ? new Date(value).toLocaleString() : 'Never'),
          },
          {
            title: 'Last used',
            dataIndex: 'lastUsedAt',
            key: 'lastUsedAt',
            render: (value?: string | null) => (value ? new Date(value).toLocaleString() : 'Never'),
          },
          {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_value, apiKey) => (
              <Button danger loading={revokingId === apiKey.id} onClick={() => onRevoke(apiKey.id)}>
                Revoke
              </Button>
            ),
          },
        ]}
        locale={{
          emptyText: <Text type="secondary">No API keys created yet.</Text>,
        }}
      />
    </Card>
  );
}

export default APIKeyList;
