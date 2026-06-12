import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Descriptions, Modal, Select, Space, Spin, Tag, Typography } from 'antd';
import PageHeader from '@/components/common/PageHeader';
import SectionCard from '@/components/common/SectionCard';
import { useDeliveryTarget, useUpdateDeliveryTarget, useDeleteDeliveryTarget } from '@/hooks/useEnvironments';

const { Text } = Typography;

const availabilityColor: Record<string, string> = {
  available: 'green',
  unavailable: 'red',
  maintenance: 'orange',
};

const healthColor: Record<string, string> = {
  healthy: 'green',
  degraded: 'orange',
  unhealthy: 'red',
};

const availabilityOptions = [
  { label: 'Available', value: 'available' },
  { label: 'Unavailable', value: 'unavailable' },
  { label: 'Maintenance', value: 'maintenance' },
];

const healthOptions = [
  { label: 'Healthy', value: 'healthy' },
  { label: 'Degraded', value: 'degraded' },
  { label: 'Unhealthy', value: 'unhealthy' },
];

export default function DeliveryTargetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const target = useDeliveryTarget(id!);
  const updateTarget = useUpdateDeliveryTarget();
  const deleteTarget = useDeleteDeliveryTarget();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editAvailability, setEditAvailability] = useState('');
  const [editHealth, setEditHealth] = useState('');

  if (target.isLoading) {
    return <Spin size="large" style={{ display: 'block', marginTop: 80 }} />;
  }

  if (target.isError) {
    return (
      <Alert
        type="error"
        showIcon
        message="Failed to load delivery target"
        description="Could not load target details. Please retry."
        action={<Button size="small" onClick={() => target.refetch()}>Retry</Button>}
      />
    );
  }

  if (!target.data) {
    return (
      <Alert
        type="warning"
        showIcon
        message="Target not found"
        description="This delivery target may have been removed."
      />
    );
  }

  const t = target.data;

  const openEditModal = () => {
    setEditAvailability(t.availabilityState);
    setEditHealth(t.healthState || 'healthy');
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    await updateTarget.mutateAsync({
      id: id!,
      request: { availabilityState: editAvailability as 'available' | 'unavailable' | 'maintenance', healthState: editHealth as 'healthy' | 'degraded' | 'unhealthy' },
    });
    setEditModalOpen(false);
  };

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <PageHeader
        eyebrow="Multi-cluster placement"
        title={t.displayName}
        description={t.purpose ? `Purpose: ${t.purpose}` : undefined}
        onBack={() => navigate('/delivery-targets')}
        actions={[
          {
            key: 'edit',
            label: 'Edit availability',
            type: 'default',
            onClick: openEditModal,
          },
          {
            key: 'delete',
            label: 'Delete target',
            type: 'default',
            onClick: () => setDeleteModalOpen(true),
            loading: deleteTarget.isPending,
          },
        ]}
      />

      <SectionCard title="Target details" bodyStyle={{ padding: 28 }}>
        <Descriptions bordered column={{ xs: 1, lg: 3 }} size="small">
          <Descriptions.Item label="Name">{t.name}</Descriptions.Item>
          <Descriptions.Item label="Display Name">{t.displayName}</Descriptions.Item>
          <Descriptions.Item label="Purpose">
            <Tag>{t.purpose || '—'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Cluster Name">{t.clusterName || '—'}</Descriptions.Item>
          <Descriptions.Item label="Cluster Server">{t.clusterServer || '—'}</Descriptions.Item>
          <Descriptions.Item label="Availability">
            <Tag color={availabilityColor[t.availabilityState] || 'default'}>{t.availabilityState}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Health">
            {t.healthState ? (
              <Tag color={healthColor[t.healthState] || 'default'}>{t.healthState}</Tag>
            ) : '—'}
          </Descriptions.Item>
        </Descriptions>
      </SectionCard>

      {t.capacitySummary ? (
        <SectionCard title="Capacity" bodyStyle={{ padding: 28 }}>
          <Descriptions bordered column={{ xs: 1, lg: 2 }} size="small">
            <Descriptions.Item label="CPU Available">{t.capacitySummary.cpuAvailable || '—'}</Descriptions.Item>
            <Descriptions.Item label="Memory Available">{t.capacitySummary.memoryAvailable || '—'}</Descriptions.Item>
          </Descriptions>
        </SectionCard>
      ) : (
        <Text type="secondary">Capacity information not available for this target.</Text>
      )}

      <Modal
        title="Edit availability"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleEditSave}
        okText="Save"
        confirmLoading={updateTarget.isPending}
        cancelButtonProps={{ disabled: updateTarget.isPending }}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div>
            <Text strong>Availability State</Text>
            <Select
              value={editAvailability}
              onChange={setEditAvailability}
              options={availabilityOptions}
              style={{ width: '100%', marginTop: 4 }}
            />
          </div>
          <div>
            <Text strong>Health State</Text>
            <Select
              value={editHealth}
              onChange={setEditHealth}
              options={healthOptions}
              style={{ width: '100%', marginTop: 4 }}
            />
          </div>
          {updateTarget.isError ? (
            <Alert
              type="error"
              showIcon
              message="Failed to update"
              description={(updateTarget.error as Error)?.message || 'Please try again.'}
            />
          ) : null}
        </Space>
      </Modal>

      <Modal
        title="Delete delivery target"
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={async () => {
          try {
            await deleteTarget.mutateAsync(id!);
            navigate('/delivery-targets');
          } catch {
            // 409 conflict — keep modal open
          }
        }}
        okText="Delete"
        okButtonProps={{ danger: true, loading: deleteTarget.isPending }}
        cancelButtonProps={{ disabled: deleteTarget.isPending }}
      >
        <Typography.Text>
          Are you sure you want to delete this delivery target? This action cannot be undone.
        </Typography.Text>
        {deleteTarget.isError ? (
          <Alert
            type="error"
            showIcon
            style={{ marginTop: 12 }}
            message="Failed to delete target"
            description={(deleteTarget.error as Error)?.message || 'The target may still be referenced by existing environments.'}
          />
        ) : null}
      </Modal>
    </Space>
  );
}