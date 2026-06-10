import { Col, Row, Space } from 'antd';
import AsyncState from '@/components/common/AsyncState';
import PageHeader from '@/components/common/PageHeader';
import SectionCard from '@/components/common/SectionCard';
import RoleTable from '@/components/admin/RoleTable';
import StatCard from '@/components/dashboard/StatCard';
import { useAdminRoles } from '@/hooks/useAdmin';

function RoleManagementPage() {
  const rolesQuery = useAdminRoles();
  const roles = rolesQuery.data ?? [];
  const permissionCount = new Set(roles.flatMap((role) => role.permissions)).size;

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <PageHeader
        eyebrow="Administration"
        title="Role management"
        description="Review role definitions and permission sets available for platform administration."
      />

      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} xl={8}>
          <StatCard title="Roles" value={roles.length} loading={rolesQuery.isLoading} />
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <StatCard title="Unique permissions" value={permissionCount} loading={rolesQuery.isLoading} />
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <StatCard
            title="Avg. permissions"
            value={roles.length ? Math.round(roles.reduce((sum, role) => sum + role.permissions.length, 0) / roles.length) : 0}
            loading={rolesQuery.isLoading}
          />
        </Col>
      </Row>

      <SectionCard
        title="Permission catalog"
        description="Compare permission sets, scan role intent, and review platform access boundaries in one section."
      >
        <AsyncState
          isLoading={rolesQuery.isLoading}
          error={rolesQuery.error instanceof Error ? rolesQuery.error : null}
          isEmpty={!rolesQuery.isLoading && !roles.length}
          onRetry={() => void rolesQuery.refetch()}
        >
          <RoleTable roles={roles} loading={rolesQuery.isFetching} />
        </AsyncState>
      </SectionCard>
    </Space>
  );
}

export default RoleManagementPage;
