import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Space, Typography } from 'antd';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import EnvironmentCreateWizard from '@/components/environments/EnvironmentCreateWizard';
import { useCreateEnvironment, useDeliveryTargets, useTemplateVersions, useTemplates } from '@/hooks/useEnvironments';
import { parseCreateEnvironmentError } from '@/services/environments';
import { createEnvironmentRequestSchema, type CreateEnvironmentError, type CreateEnvironmentRequest } from '@/types/environment';

const { Text } = Typography;

const BACKEND_FIELD_TO_FORM_PATH: Record<string, string> = {
  name: 'name',
  description: 'description',
  git_repo_url: 'gitRepoUrl',
  manifest_path: 'manifestPath',
  git_revision: 'gitRevision',
  template_version_id: 'templateVersionId',
  delivery_target_id: 'deliveryTargetId',
  expires_at: 'expiresAt',
};

function applyFieldErrors(
  setError: ReturnType<typeof useForm<CreateEnvironmentRequest>>['setError'],
  fieldErrors?: Record<string, string>,
) {
  if (!fieldErrors) return;
  for (const [backendField, message] of Object.entries(fieldErrors)) {
    const formPath = BACKEND_FIELD_TO_FORM_PATH[backendField];
    if (formPath) {
      setError(formPath as keyof CreateEnvironmentRequest, { message });
    }
  }
}

function EnvironmentCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateEnvironment();
  const [isDirtyPromptOpen, setIsDirtyPromptOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [submitError, setSubmitError] = useState<CreateEnvironmentError | null>(null);

  const templates = useTemplates();
  const templateVersions = useTemplateVersions(selectedTemplateId);
  const deliveryTargets = useDeliveryTargets();

  const form = useForm<CreateEnvironmentRequest>({
    resolver: zodResolver(createEnvironmentRequestSchema),
    defaultValues: {
      name: '',
      description: '',
      gitRepoUrl: '',
      manifestPath: '',
      gitRevision: 'main',
      templateVersionId: '',
      templateInputs: undefined,
      deliveryTargetId: '',
      expiresAt: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const environment = await createMutation.mutateAsync(values);
      navigate(`/environments/${environment.id}`, {
        replace: true,
        state: { created: true },
      });
    } catch (err: unknown) {
      const parsed = parseCreateEnvironmentError(err);
      setSubmitError(parsed);
      if (parsed.fieldErrors) {
        applyFieldErrors(form.setError, parsed.fieldErrors);
      }
    }
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
        submitError={submitError}
        templates={templates.data}
        templatesLoading={templates.isLoading}
        templatesError={templates.isError}
        onTemplatesRetry={() => templates.refetch()}
        templateVersions={templateVersions.data}
        templateVersionsLoading={templateVersions.isLoading}
        onTemplateIdChange={setSelectedTemplateId}
        selectedTemplateId={selectedTemplateId}
        deliveryTargets={deliveryTargets.data}
        deliveryTargetsLoading={deliveryTargets.isLoading}
        deliveryTargetsError={deliveryTargets.isError}
        onDeliveryTargetsRetry={() => deliveryTargets.refetch()}
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
