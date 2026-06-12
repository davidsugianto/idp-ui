import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Card, Checkbox, Form, Input, Select, Space, Typography } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import { useCreateTemplateVersion } from '@/hooks/useEnvironments';
import { createTemplateVersionSchema, type CreateTemplateVersionRequest } from '@/types/environment';

const { Text } = Typography;

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Stable', value: 'stable' },
  { label: 'Deprecated', value: 'deprecated' },
];

export default function TemplateVersionCreatePage() {
  const { id: templateId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const createVersion = useCreateTemplateVersion();

  const { control, handleSubmit, formState: { errors } } = useForm<CreateTemplateVersionRequest>({
    resolver: zodResolver(createTemplateVersionSchema),
    defaultValues: {
      version: '',
      description: '',
      isLatest: false,
      isStable: false,
      status: 'draft',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await createVersion.mutateAsync({ templateId: templateId!, request: values });
    navigate(`/templates/${templateId}`);
  });

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <PageHeader
        eyebrow="Admin"
        title="Publish template version"
        description="Create a new version of this template with optional parameters and resources."
        onBack={() => navigate(`/templates/${templateId}`)}
      />

      <Card bodyStyle={{ padding: 28 }} style={{ borderRadius: 20, border: '1px solid #f0f0f0' }}>
        <form onSubmit={onSubmit}>
          <Space direction="vertical" size={20} style={{ width: '100%', maxWidth: 600 }}>
            {createVersion.isError ? (
              <Alert
                type="error"
                showIcon
                message="Failed to publish version"
                description={(createVersion.error as Error)?.message || 'Please try again.'}
                closable
              />
            ) : null}

            <Controller
              name="version"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Version"
                  required
                  validateStatus={errors.version ? 'error' : ''}
                  help={errors.version?.message}
                >
                  <Input {...field} placeholder="e.g. 1.0.0" />
                </Form.Item>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Form.Item label="Description">
                  <Input.TextArea {...field} rows={3} placeholder="What changed in this version" />
                </Form.Item>
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Form.Item label="Status" required>
                  <Select {...field} options={statusOptions} style={{ width: '100%' }} />
                </Form.Item>
              )}
            />

            <Controller
              name="isLatest"
              control={control}
              render={({ field }) => (
                <Form.Item>
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  >
                    <Text>Mark as latest version</Text>
                  </Checkbox>
                </Form.Item>
              )}
            />

            <Controller
              name="isStable"
              control={control}
              render={({ field }) => (
                <Form.Item>
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  >
                    <Text>Mark as stable</Text>
                  </Checkbox>
                </Form.Item>
              )}
            />

            <Space>
              <Button type="primary" htmlType="submit" loading={createVersion.isPending}>
                Publish version
              </Button>
              <Button onClick={() => navigate(`/templates/${templateId}`)} disabled={createVersion.isPending}>
                Cancel
              </Button>
            </Space>
          </Space>
        </form>
      </Card>
    </Space>
  );
}