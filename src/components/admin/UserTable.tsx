import { Space, Table, Tag, Typography } from 'antd';
import type { AdminUserRecord } from '@/types/admin';

const { Text } = Typography;

interface UserTableProps {
  users: AdminUserRecord[];
  loading?: boolean;
}

function getStatusColor(status: string) {
  if (status === 'active') return 'green';
  if (status === 'pending') return 'gold';
  if (status === 'suspended') return 'volcano';
  return 'default';
}

function UserTable({ users, loading = false }: UserTableProps) {
  return (
    <Table<AdminUserRecord>
      rowKey="id"
      loading={loading}
      pagination={false}
      size="middle"
      scroll={{ x: 960 }}
      dataSource={users}
      locale={{
        emptyText: <Text type="secondary">No users match the current view.</Text>,
      }}
      columns={[
        {
          title: 'User',
          key: 'user',
          render: (_value, user) => (
            <Space direction="vertical" size={2}>
              <Text strong>{user.name}</Text>
              <Text type="secondary">{user.email}</Text>
            </Space>
          ),
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          width: 140,
          render: (status: string) => <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>,
        },
        {
          title: 'Roles',
          key: 'roles',
          render: (_value, user) =>
            user.roles.length ? (
              <Space size={[6, 6]} wrap>
                {user.roles.map((role) => (
                  <Tag key={role} color="blue">
                    {role}
                  </Tag>
                ))}
              </Space>
            ) : (
              '—'
            ),
        },
        {
          title: 'Groups',
          key: 'groups',
          render: (_value, user) =>
            user.groups.length ? (
              <Space size={[6, 6]} wrap>
                {user.groups.map((group) => (
                  <Tag key={group}>{group}</Tag>
                ))}
              </Space>
            ) : (
              '—'
            ),
        },
      ]}
    />
  );
}

export default UserTable;
