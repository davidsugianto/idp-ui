import { useMemo, useState } from 'react';
import { Col, Input, Row, Select, Space } from 'antd';
import AsyncState from '@/components/common/AsyncState';
import ManagementToolbar from '@/components/common/ManagementToolbar';
import PageHeader from '@/components/common/PageHeader';
import SectionCard from '@/components/common/SectionCard';
import AuditLogTable from '@/components/admin/AuditLogTable';
import StatCard from '@/components/dashboard/StatCard';
import { useAuditLogs } from '@/hooks/useAdmin';

function AuditLogPage() {
  const auditLogsQuery = useAuditLogs();
  const [search, setSearch] = useState('');
  const [outcome, setOutcome] = useState<'all' | string>('all');
  const records = useMemo(() => auditLogsQuery.data ?? [], [auditLogsQuery.data]);

  const outcomeOptions = useMemo(
    () => ['all', ...new Set(records.map((record) => record.outcome).filter(Boolean))],
    [records],
  );

  const filteredRecords = useMemo(
    () =>
      records.filter((record) => {
        const term = search.toLowerCase();
        const matchesSearch =
          !term ||
          record.actor.toLowerCase().includes(term) ||
          record.action.toLowerCase().includes(term) ||
          record.resource.toLowerCase().includes(term);
        const matchesOutcome = outcome === 'all' || record.outcome === outcome;
        return matchesSearch && matchesOutcome;
      }),
    [records, search, outcome],
  );

  const successCount = records.filter((record) => record.outcome === 'success').length;

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <PageHeader
        eyebrow="Administration"
        title="Audit logs"
        description="Track recent administrative actions, affected resources, and recorded outcomes."
      />

      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} xl={8}>
          <StatCard title="Events" value={records.length} loading={auditLogsQuery.isLoading} />
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <StatCard title="Successful" value={successCount} loading={auditLogsQuery.isLoading} />
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <StatCard title="Flagged" value={records.length - successCount} loading={auditLogsQuery.isLoading} />
        </Col>
      </Row>

      <SectionCard
        title="Activity stream"
        description="Search the latest administrative events and filter the stream by recorded outcome."
      >
        <Space direction="vertical" size={18} style={{ width: '100%' }}>
          <ManagementToolbar
            primary={
              <Input.Search
                allowClear
                placeholder="Search actors, actions, or resources"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                style={{ width: 320 }}
              />
            }
            secondary={
              <Select
                style={{ width: 180 }}
                value={outcome}
                options={outcomeOptions.map((value) => ({
                  label: value === 'all' ? 'All outcomes' : value.charAt(0).toUpperCase() + value.slice(1),
                  value,
                }))}
                onChange={setOutcome}
              />
            }
          />

          <AsyncState
            isLoading={auditLogsQuery.isLoading}
            error={auditLogsQuery.error instanceof Error ? auditLogsQuery.error : null}
            isEmpty={!auditLogsQuery.isLoading && !records.length}
            onRetry={() => void auditLogsQuery.refetch()}
          >
            <AuditLogTable records={filteredRecords} loading={auditLogsQuery.isFetching} />
          </AsyncState>
        </Space>
      </SectionCard>
    </Space>
  );
}

export default AuditLogPage;
