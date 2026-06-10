import { useMemo, useState } from 'react';
import { Alert, Col, Input, Row, Select, Space } from 'antd';
import AsyncState from '@/components/common/AsyncState';
import ManagementToolbar from '@/components/common/ManagementToolbar';
import PageHeader from '@/components/common/PageHeader';
import SectionCard from '@/components/common/SectionCard';
import UserTable from '@/components/admin/UserTable';
import StatCard from '@/components/dashboard/StatCard';
import { useAdminUsers } from '@/hooks/useAdmin';

function UserManagementPage() {
  const usersQuery = useAdminUsers();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | string>('all');
  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);

  const statusOptions = useMemo(
    () => ['all', ...new Set(users.map((user) => user.status).filter(Boolean))],
    [users],
  );

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesSearch =
          !search ||
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.roles.some((role) => role.toLowerCase().includes(search.toLowerCase())) ||
          user.groups.some((group) => group.toLowerCase().includes(search.toLowerCase()));
        const matchesStatus = status === 'all' || user.status === status;
        return matchesSearch && matchesStatus;
      }),
    [users, search, status],
  );

  const activeUsers = users.filter((user) => user.status === 'active').length;
  const uniqueRoles = new Set(users.flatMap((user) => user.roles)).size;

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <PageHeader
        eyebrow="Administration"
        title="User management"
        description="Review account status, assigned roles, and group membership for portal users."
      />

      <Alert
        type="info"
        showIcon
        message="Administrator access required"
        description="Only administrators can review and coordinate access records from this workspace."
      />

      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} xl={8}>
          <StatCard title="Total users" value={users.length} loading={usersQuery.isLoading} />
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <StatCard title="Active users" value={activeUsers} loading={usersQuery.isLoading} />
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <StatCard title="Assigned roles" value={uniqueRoles} loading={usersQuery.isLoading} />
        </Col>
      </Row>

      <SectionCard
        title="User access directory"
        description="Search current user records, scan role assignments, and review group membership from one table."
      >
        <Space direction="vertical" size={18} style={{ width: '100%' }}>
          <ManagementToolbar
            primary={
              <Input.Search
                allowClear
                placeholder="Search users, emails, roles, or groups"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                style={{ width: 320 }}
              />
            }
            secondary={
              <Select
                style={{ width: 180 }}
                value={status}
                options={statusOptions.map((value) => ({
                  label: value === 'all' ? 'All statuses' : value.charAt(0).toUpperCase() + value.slice(1),
                  value,
                }))}
                onChange={setStatus}
              />
            }
          />

          <AsyncState
            isLoading={usersQuery.isLoading}
            error={usersQuery.error instanceof Error ? usersQuery.error : null}
            isEmpty={!usersQuery.isLoading && !users.length}
            onRetry={() => void usersQuery.refetch()}
          >
            <UserTable users={filteredUsers} loading={usersQuery.isFetching} />
          </AsyncState>
        </Space>
      </SectionCard>
    </Space>
  );
}

export default UserManagementPage;
