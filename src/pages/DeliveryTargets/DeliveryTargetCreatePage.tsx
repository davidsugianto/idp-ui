import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Card, Form, Input, Select, Space } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import { useCreateDeliveryTarget } from '@/hooks/useEnvironments';
import { createDeliveryTargetSchema, type CreateDeliveryTargetRequest } from '@/types/environment';

const purposeOptions = [
  { label: 'Development', value: 'dev' },
  { label: 'Staging', value: 'staging' },
  { label: 'Production', value: 'production' },
  { label: 'Disaster Recovery', value: 'dr' },
];

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

export default function DeliveryTargetCreatePage() {
  const navigate = useNavigate();
  const createTarget = useCreateDeliveryTarget();

  const { control, handleSubmit, formState: { errors } } = useForm<CreateDeliveryTargetRequest>({
    resolver: zodResolver(createDeliveryTargetSchema),
    defaultValues: {
      name: '',
      displayName: '',
      purpose: 'dev',
      clusterName: '',
      clusterServer: '',
      availabilityState: 'available',
      healthState: 'healthy',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await createTarget.mutateAsync(values);
    navigate(`/delivery-targets/${result.id}`);
  });

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <PageHeader
        eyebrow="Admin"
        title="Register delivery target"
        description="Add a new Kubernetes cluster as an environment placement target."
        onBack={() => navigate('/delivery-targets')}
      />

      <Card bodyStyle={{ padding: 28 }} style={{ borderRadius: 20, border: '1px solid #f0f0f0' }}>
        <form onSubmit={onSubmit}>
          <Space direction="vertical" size={20} style={{ width: '100%', maxWidth: 600 }}>
            {createTarget.isError ? (
              <Alert
                type="error"
                showIcon
                message="Failed to register delivery target"
                description={(createTarget.error as Error)?.message || 'Please try again.'}
                closable
              />
            ) : null}

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Name"
                  required
                  validateStatus={errors.name ? 'error' : ''}
                  help={errors.name?.message}
                >
                  <Input {...field} placeholder="e.g. us-east-1-prod" />
                </Form.Item>
              )}
            />

            <Controller
              name="displayName"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Display Name"
                  required
                  validateStatus={errors.displayName ? 'error' : ''}
                  help={errors.displayName?.message}
                >
                  <Input {...field} placeholder="e.g. US East 1 Production" />
                </Form.Item>
              )}
            />

            <Controller
              name="purpose"
              control={control}
              render={({ field }) => (
                <Form.Item label="Purpose" required>
                  <Select {...field} options={purposeOptions} style={{ width: '100%' }} />
                </Form.Item>
              )}
            />

            <Controller
              name="clusterName"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Cluster Name"
                  required
                  validateStatus={errors.clusterName ? 'error' : ''}
                  help={errors.clusterName?.message}
                >
                  <Input {...field} placeholder="Kubernetes cluster name" />
                </Form.Item>
              )}
            />

            <Controller
              name="clusterServer"
              control={control}
              render={({ field }) => (
                <Form.Item label="Cluster Server URL">
                  <Input {...field} placeholder="https://api.example.com:6443" />
                </Form.Item>
              )}
            />

            <Controller
              name="availabilityState"
              control={control}
              render={({ field }) => (
                <Form.Item label="Availability" required>
                  <Select {...field} options={availabilityOptions} style={{ width: '100%' }} />
                </Form.Item>
              )}
            />

            <Controller
              name="healthState"
              control={control}
              render={({ field }) => (
                <Form.Item label="Health" required>
                  <Select {...field} options={healthOptions} style={{ width: '100%' }} />
                </Form.Item>
              )}
            />

            <Space>
              <Button type="primary" htmlType="submit" loading={createTarget.isPending}>
                Register target
              </Button>
              <Button onClick={() => navigate('/delivery-targets')} disabled={createTarget.isPending}>
                Cancel
              </Button>
            </Space>
          </Space>
        </form>
      </Card>
    </Space>
  );
}