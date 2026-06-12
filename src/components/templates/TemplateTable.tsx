import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TemplateSummary } from '@/types/environment';

interface TemplateTableProps {
  data: TemplateSummary[];
  loading?: boolean;
  onRow?: (record: TemplateSummary) => { onClick: () => void };
}

const columns: ColumnsType<TemplateSummary> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    render: (category?: string) => category || '—',
  },
  {
    title: 'Latest Version',
    dataIndex: 'latestVersion',
    key: 'latestVersion',
    render: (version?: string) => version ? <Tag color="blue">{version}</Tag> : '—',
  },
  {
    title: 'Visibility',
    dataIndex: 'visibility',
    key: 'visibility',
    render: (visibility?: string) => (
      <Tag color={visibility === 'public' ? 'green' : 'orange'}>{visibility || '—'}</Tag>
    ),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    render: (description?: string) => description || '—',
  },
];

export default function TemplateTable({ data, loading, onRow }: TemplateTableProps) {
  return (
    <Table<TemplateSummary>
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      onRow={onRow ? (record) => ({ style: { cursor: 'pointer' }, onClick: onRow(record).onClick }) : undefined}
      pagination={{ pageSize: 20, showSizeChanger: true }}
      locale={{ emptyText: 'No templates available. Templates are created by platform administrators.' }}
    />
  );
}