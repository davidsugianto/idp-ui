import { Col, Row, Space } from 'antd';
import AsyncState from '@/components/common/AsyncState';
import PageHeader from '@/components/common/PageHeader';
import SectionCard from '@/components/common/SectionCard';
import TeamTable from '@/components/admin/TeamTable';
import StatCard from '@/components/dashboard/StatCard';
import { useAdminTeams } from '@/hooks/useAdmin';

function TeamManagementPage() {
  const teamsQuery = useAdminTeams();
  const teams = teamsQuery.data ?? [];
  const totalMembers = teams.reduce((sum, team) => sum + team.memberCount, 0);

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <PageHeader
        eyebrow="Administration"
        title="Team management"
        description="Inspect team ownership boundaries and current member counts across the platform."
      />

      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} xl={8}>
          <StatCard title="Teams" value={teams.length} loading={teamsQuery.isLoading} />
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <StatCard title="Members" value={totalMembers} loading={teamsQuery.isLoading} />
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <StatCard
            title="Avg. team size"
            value={teams.length ? Math.round(totalMembers / teams.length) : 0}
            loading={teamsQuery.isLoading}
          />
        </Col>
      </Row>

      <SectionCard
        title="Team directory"
        description="Review team coverage, compare member counts, and inspect ownership context from a single operational view."
      >
        <AsyncState
          isLoading={teamsQuery.isLoading}
          error={teamsQuery.error instanceof Error ? teamsQuery.error : null}
          isEmpty={!teamsQuery.isLoading && !teams.length}
          onRetry={() => void teamsQuery.refetch()}
        >
          <TeamTable teams={teams} loading={teamsQuery.isFetching} />
        </AsyncState>
      </SectionCard>
    </Space>
  );
}

export default TeamManagementPage;
