import { Space, Table, Tag, Typography } from 'antd';
import type { RoleRecord } from '@/types/admin';

const { Text } = Typography;

interface RoleTableProps {
  roles: RoleRecord[];
  loading?: boolean;
}

function RoleTable({ roles, loading = false }: RoleTableProps) {
  return (
    <Table<RoleRecord>
      rowKey="id"
      loading={loading}
      pagination={false}
      size="middle"
      scroll={{ x: 860 }}
      dataSource={roles}
      locale={{
        emptyText: <Text type="secondary">No roles match the current view.</Text>,
      }}
      columns={[
        {
          title: 'Role',
          key: 'role',
          render: (_value, role) => (
            <Space direction="vertical" size={2}>
              <Text strong>{role.name}</Text>
              <Text type="secondary">{role.description || 'No role description provided.'}</Text>
            </Space>
          ),
        },
        {
          title: 'Permissions',
          key: 'permissions',
          render: (_value, role) =>
            role.permissions.length ? (
              <Space size={[6, 6]} wrap>
                {role.permissions.map((permission) => (
                  <Tag key={permission} color="purple">
                    {permission}
                  </Tag>
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

export default RoleTable;
