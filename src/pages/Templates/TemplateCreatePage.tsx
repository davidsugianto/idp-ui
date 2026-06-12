import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Card, Form, Input, Radio, Select, Space } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import { useCreateTemplate } from '@/hooks/useEnvironments';
import { createTemplateSchema, type CreateTemplateRequest } from '@/types/environment';

const categoryOptions = [
  { label: 'Service', value: 'service' },
  { label: 'Infrastructure', value: 'infra' },
  { label: 'Database', value: 'database' },
];

export default function TemplateCreatePage() {
  const navigate = useNavigate();
  const createTemplate = useCreateTemplate();

  const { control, handleSubmit, watch, formState: { errors } } = useForm<CreateTemplateRequest>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      author: '',
      authorEmail: '',
      visibility: 'public',
      teamId: '',
    },
  });

  const visibility = watch('visibility');

  const onSubmit = handleSubmit(async (values) => {
    const result = await createTemplate.mutateAsync(values);
    navigate(`/templates/${result.id}`);
  });

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <PageHeader
        eyebrow="Admin"
        title="Create template"
        description="Register a new reusable environment template."
        onBack={() => navigate('/templates')}
      />

      <Card bodyStyle={{ padding: 28 }} style={{ borderRadius: 20, border: '1px solid #f0f0f0' }}>
        <form onSubmit={onSubmit}>
          <Space direction="vertical" size={20} style={{ width: '100%', maxWidth: 600 }}>
            {createTemplate.isError ? (
              <Alert
                type="error"
                showIcon
                message="Failed to create template"
                description={(createTemplate.error as Error)?.message || 'Please try again.'}
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
                  <Input {...field} placeholder="e.g. python-microservice" />
                </Form.Item>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Description"
                  validateStatus={errors.description ? 'error' : ''}
                  help={errors.description?.message}
                >
                  <Input.TextArea {...field} rows={3} placeholder="Brief description of this template" />
                </Form.Item>
              )}
            />

            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Form.Item label="Category">
                  <Select
                    {...field}
                    options={categoryOptions}
                    placeholder="Select a category"
                    allowClear
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              )}
            />

            <Controller
              name="author"
              control={control}
              render={({ field }) => (
                <Form.Item label="Author">
                  <Input {...field} placeholder="Author name" />
                </Form.Item>
              )}
            />

            <Controller
              name="authorEmail"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Author Email"
                  validateStatus={errors.authorEmail ? 'error' : ''}
                  help={errors.authorEmail?.message}
                >
                  <Input {...field} placeholder="author@example.com" />
                </Form.Item>
              )}
            />

            <Controller
              name="visibility"
              control={control}
              render={({ field }) => (
                <Form.Item label="Visibility" required>
                  <Radio.Group {...field}>
                    <Radio.Button value="public">Public</Radio.Button>
                    <Radio.Button value="team">Team</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              )}
            />

            {visibility === 'team' ? (
              <Controller
                name="teamId"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Team ID"
                    required
                    validateStatus={errors.teamId ? 'error' : ''}
                    help={errors.teamId?.message}
                  >
                    <Input {...field} placeholder="Team identifier" />
                  </Form.Item>
                )}
              />
            ) : null}

            <Space>
              <Button type="primary" htmlType="submit" loading={createTemplate.isPending}>
                Create template
              </Button>
              <Button onClick={() => navigate('/templates')} disabled={createTemplate.isPending}>
                Cancel
              </Button>
            </Space>
          </Space>
        </form>
      </Card>
    </Space>
  );
}