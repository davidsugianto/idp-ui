import { Table, Tag, Typography } from 'antd';
import type { Workload, WorkloadSummary } from '@/types/environment';

const { Text } = Typography;

interface WorkloadTableProps {
  workloads: Workload[];
  loading?: boolean;
  summary?: WorkloadSummary;
}

function WorkloadTable({ workloads, loading = false, summary }: WorkloadTableProps) {
  return (
    <Table<Workload>
      rowKey={(workload) => `${workload.kind}-${workload.name}`}
      loading={loading}
      pagination={false}
      locale={{
        emptyText: summary ? (
          <Text type="secondary">No workloads found for {summary.totalPods} pods.</Text>
        ) : (
          <Text type="secondary">No workloads found.</Text>
        ),
      }}
      dataSource={workloads}
      columns={[
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Type',
          dataIndex: 'kind',
          key: 'kind',
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: (status: string) => <Tag>{status}</Tag>,
        },
        {
          title: 'Ready',
          key: 'ready',
          render: (_value, workload) => `${workload.readyReplicas}/${workload.desiredReplicas}`,
        },
        {
          title: 'Image',
          dataIndex: 'image',
          key: 'image',
          ellipsis: true,
        },
      ]}
    />
  );
}

export default WorkloadTable;
