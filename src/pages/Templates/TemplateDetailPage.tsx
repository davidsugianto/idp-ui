import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Descriptions, Modal, Space, Spin, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageHeader from '@/components/common/PageHeader';
import SectionCard from '@/components/common/SectionCard';
import { useTemplate, useTemplateVersions, useDeleteTemplate } from '@/hooks/useEnvironments';
import type { TemplateVersion } from '@/types/environment';

const { Text } = Typography;

const versionColumns: ColumnsType<TemplateVersion> = [
  {
    title: 'Version',
    dataIndex: 'version',
    key: 'version',
    render: (version: string) => <Text strong>{version}</Text>,
  },
  {
    title: 'Status',
    key: 'status',
    render: (_: unknown, record: TemplateVersion) => (
      <Space size={4} wrap>
        <Tag color={record.status === 'stable' ? 'green' : record.status === 'deprecated' ? 'red' : 'default'}>
          {record.status}
        </Tag>
        {record.isLatest ? <Tag color="blue">latest</Tag> : null}
        {record.isStable ? <Tag color="geekblue">stable</Tag> : null}
      </Space>
    ),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    render: (desc?: string) => desc || '—',
  },
];

export default function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const template = useTemplate(id!);
  const versions = useTemplateVersions(id!);
  const deleteTemplate = useDeleteTemplate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  if (template.isLoading) {
    return <Spin size="large" style={{ display: 'block', marginTop: 80 }} />;
  }

  if (template.isError) {
    return (
      <Alert
        type="error"
        showIcon
        message="Failed to load template"
        description="Could not load template details. Please retry."
        action={<Button size="small" onClick={() => template.refetch()}>Retry</Button>}
      />
    );
  }

  if (!template.data) {
    return (
      <Alert
        type="warning"
        showIcon
        message="Template not found"
        description="This template may have been removed."
      />
    );
  }

  const tpl = template.data;

  const latestVersion = tpl.latestVersion
    || (versions.data?.find((v) => v.isLatest)?.version);

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <PageHeader
        eyebrow="Template catalog"
        title={tpl.name}
        description={tpl.description || 'No description provided.'}
        onBack={() => navigate('/templates')}
        actions={[
          {
            key: 'delete',
            label: 'Delete template',
            type: 'default',
            onClick: () => setDeleteModalOpen(true),
            loading: deleteTemplate.isPending,
          },
        ]}
      />

      <SectionCard title="Template details" bodyStyle={{ padding: 28 }}>
        <Descriptions bordered column={{ xs: 1, lg: 3 }} size="small">
          <Descriptions.Item label="Category">{tpl.category || '—'}</Descriptions.Item>
          <Descriptions.Item label="Author">{tpl.author || '—'}</Descriptions.Item>
          <Descriptions.Item label="Visibility">
            <Tag color={tpl.visibility === 'public' ? 'green' : 'orange'}>{tpl.visibility || '—'}</Tag>
          </Descriptions.Item>
          {tpl.teamId ? <Descriptions.Item label="Team">{tpl.teamId}</Descriptions.Item> : null}
          <Descriptions.Item label="Latest Version">
            {latestVersion ? <Tag color="blue">{latestVersion}</Tag> : '—'}
          </Descriptions.Item>
        </Descriptions>
      </SectionCard>

      <SectionCard title="Version history" bodyStyle={{ padding: 28 }}>
        {versions.isLoading ? (
          <Spin size="small" />
        ) : versions.isError ? (
          <Alert
            type="error"
            showIcon
            message="Failed to load versions"
            action={<Button size="small" onClick={() => versions.refetch()}>Retry</Button>}
          />
        ) : (
          <>
            <Table<TemplateVersion>
              columns={versionColumns}
              dataSource={versions.data}
              rowKey="id"
              pagination={false}
              locale={{ emptyText: 'No versions published yet.' }}
              expandable={{
                expandedRowRender: (version: TemplateVersion) => (
                  <Space direction="vertical" size={12} style={{ padding: 12 }}>
                    {version.parameters && version.parameters.length > 0 ? (
                      <div>
                        <Text strong>Parameters</Text>
                        <Table
                          dataSource={version.parameters}
                          rowKey="name"
                          pagination={false}
                          size="small"
                          columns={[
                            { title: 'Name', dataIndex: 'name', key: 'name' },
                            { title: 'Display Name', dataIndex: 'displayName', key: 'displayName' },
                            {
                              title: 'Type',
                              dataIndex: 'type',
                              key: 'type',
                              render: (t: string) => <Tag>{t}</Tag>,
                            },
                            {
                              title: 'Required',
                              dataIndex: 'required',
                              key: 'required',
                              render: (r: boolean) => r ? <Tag color="red">Yes</Tag> : <Tag>No</Tag>,
                            },
                            {
                              title: 'Default',
                              dataIndex: 'defaultValue',
                              key: 'defaultValue',
                              render: (dv?: string) => dv || '—',
                            },
                          ]}
                        />
                      </div>
                    ) : (
                      <Text type="secondary">No parameters defined for this version.</Text>
                    )}
                    {version.resources && version.resources.length > 0 ? (
                      <div style={{ marginTop: 12 }}>
                        <Text strong>Resources</Text>
                        <Table
                          dataSource={version.resources}
                          rowKey="name"
                          pagination={false}
                          size="small"
                          columns={[
                            { title: 'Kind', dataIndex: 'kind', key: 'kind' },
                            { title: 'Name', dataIndex: 'name', key: 'name' },
                          ]}
                        />
                      </div>
                    ) : null}
                  </Space>
                ),
              }}
            />
            <div style={{ marginTop: 16 }}>
              <Button type="primary" onClick={() => navigate(`/admin/templates/${id}/versions/new`)}>
                Publish version
              </Button>
            </div>
          </>
        )}
      </SectionCard>

      <Modal
        title="Delete template"
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={async () => {
          try {
            await deleteTemplate.mutateAsync(id!);
            navigate('/templates');
          } catch {
            // 409 conflict or other error — keep modal open so user can retry
          }
        }}
        okText="Delete"
        okButtonProps={{ danger: true, loading: deleteTemplate.isPending }}
        cancelButtonProps={{ disabled: deleteTemplate.isPending }}
      >
        <Typography.Text>
          Are you sure you want to delete this template? This action cannot be undone.
        </Typography.Text>
        {deleteTemplate.isError ? (
          <Alert
            type="error"
            showIcon
            style={{ marginTop: 12 }}
            message="Failed to delete template"
            description={(deleteTemplate.error as Error)?.message || 'The template may still be in use by existing environments.'}
          />
        ) : null}
      </Modal>
    </Space>
  );
}