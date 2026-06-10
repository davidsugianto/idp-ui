import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, DatePicker, Form, Input, Modal } from 'antd';
import type { Dayjs } from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import type { CreateApiKeyRequest } from '@/types/apiKey';

const createApiKeySchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  expiresAt: z.any().optional(),
});

interface CreateApiKeyValues {
  name: string;
  expiresAt: Dayjs | null;
}

interface APIKeyCreateModalProps {
  open: boolean;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onSubmit: (values: CreateApiKeyRequest) => Promise<void> | void;
}

function APIKeyCreateModal({ open, isSubmitting = false, errorMessage, onCancel, onSubmit }: APIKeyCreateModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateApiKeyValues>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      name: '',
      expiresAt: null,
    },
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit({
      name: values.name.trim(),
      expiresAt: values.expiresAt?.toISOString() || undefined,
    });
    reset();
  });

  return (
    <Modal
      title="Create API key"
      open={open}
      onCancel={() => {
        reset();
        onCancel();
      }}
      footer={null}
      destroyOnHidden
    >
      {errorMessage ? <Alert type="error" showIcon message="Failed to create API key" description={errorMessage} style={{ marginBottom: 16 }} /> : null}
      <Form layout="vertical" onFinish={() => void submit()}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Form.Item label="Name" validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
              <Input {...field} placeholder="CI deployment key" />
            </Form.Item>
          )}
        />
        <Controller
          name="expiresAt"
          control={control}
          render={({ field }) => (
            <Form.Item label="Expires at" help={errors.expiresAt?.message ?? 'Optional. Select a date and time for the key to expire.'} validateStatus={errors.expiresAt ? 'error' : ''}>
              <DatePicker
                showTime
                style={{ width: '100%' }}
                placeholder="Select expiration date"
                value={field.value}
                onChange={field.onChange}
              />
            </Form.Item>
          )}
        />
        <Form.Item style={{ marginBottom: 0 }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Create key
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default APIKeyCreateModal;
