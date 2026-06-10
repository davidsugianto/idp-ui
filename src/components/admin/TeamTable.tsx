import { Space, Table, Tag, Typography } from 'antd';
import type { TeamRecord } from '@/types/admin';

const { Text } = Typography;

interface TeamTableProps {
  teams: TeamRecord[];
  loading?: boolean;
}

function TeamTable({ teams, loading = false }: TeamTableProps) {
  return (
    <Table<TeamRecord>
      rowKey="id"
      loading={loading}
      pagination={false}
      size="middle"
      scroll={{ x: 780 }}
      dataSource={teams}
      locale={{
        emptyText: <Text type="secondary">No teams match the current view.</Text>,
      }}
      columns={[
        {
          title: 'Team',
          key: 'team',
          render: (_value, team) => (
            <Space direction="vertical" size={2}>
              <Text strong>{team.name}</Text>
              <Text type="secondary">{team.description || 'No team description provided.'}</Text>
            </Space>
          ),
        },
        {
          title: 'Members',
          dataIndex: 'memberCount',
          key: 'memberCount',
          width: 160,
          render: (memberCount: number) => <Tag color="cyan">{memberCount.toLocaleString()} members</Tag>,
        },
      ]}
    />
  );
}

export default TeamTable;
