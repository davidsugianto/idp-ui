import { Alert, Col, Row, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import SectionCard from '@/components/common/SectionCard';
import StatCard from '@/components/dashboard/StatCard';
import { useAdminRoles, useAdminTeams, useAdminUsers, useAuditLogs } from '@/hooks/useAdmin';

const { Text } = Typography;

const adminSections = [
  {
    title: 'Users',
    description: 'Review access, account status, and assigned roles.',
    href: '/admin/users',
  },
  {
    title: 'Teams',
    description: 'Inspect team ownership and member counts.',
    href: '/admin/teams',
  },
  {
    title: 'Roles',
    description: 'Review platform permissions and role definitions.',
    href: '/admin/roles',
  },
  {
    title: 'Audit logs',
    description: 'Track recent administrative activity and outcomes.',
    href: '/admin/audit-logs',
  },
];

function AdminDashboardPage() {
  const navigate = useNavigate();
  const usersQuery = useAdminUsers();
  const teamsQuery = useAdminTeams();
  const rolesQuery = useAdminRoles();
  const auditLogsQuery = useAuditLogs();
  const recentActivity = (auditLogsQuery.data ?? []).slice(0, 4);
  const hasError = usersQuery.isError || teamsQuery.isError || rolesQuery.isError || auditLogsQuery.isError;

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <PageHeader
        eyebrow="Admin workspace"
        title="Platform control center"
        description="Review access, permissions, ownership boundaries, and the latest administrative activity from one operational workspace."
        actions={[
          {
            key: 'review-users',
            label: 'Review users',
            type: 'primary',
            onClick: () => navigate('/admin/users'),
          },
          {
            key: 'open-audit',
            label: 'Open audit logs',
            onClick: () => navigate('/admin/audit-logs'),
          },
        ]}
      />

      {hasError ? (
        <Alert
          type="warning"
          showIcon
          message="Some admin metrics are temporarily unavailable"
          description="You can still navigate into each admin workspace while summary data refreshes in the background."
        />
      ) : null}

      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} xl={6}>
          <StatCard title="Users" value={usersQuery.data?.length ?? 0} loading={usersQuery.isLoading} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard title="Teams" value={teamsQuery.data?.length ?? 0} loading={teamsQuery.isLoading} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard title="Roles" value={rolesQuery.data?.length ?? 0} loading={rolesQuery.isLoading} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard title="Audit events" value={auditLogsQuery.data?.length ?? 0} loading={auditLogsQuery.isLoading} />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={14}>
          <SectionCard
            title="Administrative workspaces"
            description="Move between operational areas with the same table-first workflow and consistent page tooling."
          >
            <Row gutter={[16, 16]}>
              {adminSections.map((section) => (
                <Col xs={24} md={12} key={section.href}>
                  <SectionCard
                    title={section.title}
                    extra={<Link to={section.href}>Open</Link>}
                    bodyStyle={{ padding: 20 }}
                    style={{ height: '100%', borderRadius: 18 }}
                  >
                    <Text type="secondary">{section.description}</Text>
                  </SectionCard>
                </Col>
              ))}
            </Row>
          </SectionCard>
        </Col>
        <Col xs={24} xl={10}>
          <SectionCard
            title="Recent activity"
            description="Review the latest administrative outcomes before drilling into the full audit stream."
          >
            {recentActivity.length ? (
              <Space direction="vertical" size={14} style={{ width: '100%' }}>
                {recentActivity.map((record) => (
                  <div
                    key={record.id}
                    style={{
                      padding: 16,
                      borderRadius: 16,
                      background: '#f8fafc',
                      border: '1px solid #eef2f7',
                    }}
                  >
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      <Text strong>{record.action}</Text>
                      <Text type="secondary">
                        {record.actor} · {record.resource}
                      </Text>
                      <Text type="secondary">{new Date(record.createdAt).toLocaleString()}</Text>
                    </Space>
                  </div>
                ))}
              </Space>
            ) : (
              <Text type="secondary">No recent activity available.</Text>
            )}
          </SectionCard>
        </Col>
      </Row>
    </Space>
  );
}

export default AdminDashboardPage;
