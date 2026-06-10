import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Space, Typography } from 'antd';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import EnvironmentCreateWizard from '@/components/environments/EnvironmentCreateWizard';
import { useCreateEnvironment } from '@/hooks/useEnvironments';
import { createEnvironmentRequestSchema, type CreateEnvironmentRequest } from '@/types/environment';

const { Text } = Typography;

function EnvironmentCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateEnvironment();
  const [isDirtyPromptOpen, setIsDirtyPromptOpen] = useState(false);
  const form = useForm<CreateEnvironmentRequest>({
    resolver: zodResolver(createEnvironmentRequestSchema),
    defaultValues: {
      name: '',
      description: '',
      gitRepoUrl: '',
      manifestPath: '',
      gitRevision: 'main',
      clusterName: '',
      resourceQuotaCpu: '',
      resourceQuotaMemory: '',
      expiresAt: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const environment = await createMutation.mutateAsync(values);
    navigate(`/environments/${environment.id}`, {
      replace: true,
      state: { created: true },
    });
  });

  const handleCancel = () => {
    if (form.formState.isDirty && !createMutation.isPending) {
      setIsDirtyPromptOpen(true);
      return;
    }

    navigate('/environments');
  };

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <PageHeader
        eyebrow="Delivery workflow"
        title="Create environment"
        description="Use the guided flow to define the environment, verify the GitOps source, and review deployment settings before submission."
      />

      <EnvironmentCreateWizard
        form={form}
        onSubmit={() => void onSubmit()}
        onCancel={handleCancel}
        isSubmitting={createMutation.isPending}
        submitError={createMutation.error instanceof Error ? createMutation.error.message : null}
      />

      <Modal
        title="Discard this environment draft?"
        open={isDirtyPromptOpen}
        onCancel={() => setIsDirtyPromptOpen(false)}
        onOk={() => {
          setIsDirtyPromptOpen(false);
          navigate('/environments');
        }}
        okText="Discard draft"
        cancelText="Keep editing"
      >
        <Text>You have unsaved changes in this environment flow. Leaving now will discard the draft.</Text>
      </Modal>
    </Space>
  );
}

export default EnvironmentCreatePage;
