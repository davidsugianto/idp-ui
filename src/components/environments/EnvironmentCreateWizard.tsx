import { Alert, Button, Col, DatePicker, Form, Input, Row, Select, Space, Steps, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { Controller, useWatch, type FieldErrors, type FieldPath, type UseFormReturn } from 'react-hook-form';
import SectionCard from '@/components/common/SectionCard';
import type { CreateEnvironmentError, CreateEnvironmentRequest, DeliveryTarget, TemplateSummary, TemplateVersion } from '@/types/environment';

const { Text, Title } = Typography;

interface EnvironmentCreateWizardProps {
  form: UseFormReturn<CreateEnvironmentRequest>;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitError?: CreateEnvironmentError | null;
  templates?: TemplateSummary[];
  templatesLoading?: boolean;
  templatesError?: boolean;
  onTemplatesRetry?: () => void;
  templateVersions?: TemplateVersion[];
  templateVersionsLoading?: boolean;
  onTemplateIdChange?: (id: string) => void;
  selectedTemplateId?: string;
  deliveryTargets?: DeliveryTarget[];
  deliveryTargetsLoading?: boolean;
  deliveryTargetsError?: boolean;
  onDeliveryTargetsRetry?: () => void;
}

const stepFields: Array<FieldPath<CreateEnvironmentRequest>[]> = [
  ['name', 'description'],
  ['gitRepoUrl', 'manifestPath', 'gitRevision'],
  ['deliveryTargetId', 'expiresAt'],
];

function EnvironmentCreateWizard({
  form,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitError,
  templates,
  templatesLoading,
  templatesError,
  onTemplatesRetry,
  templateVersions,
  templateVersionsLoading,
  onTemplateIdChange,
  selectedTemplateId = '',
  deliveryTargets,
  deliveryTargetsLoading,
  deliveryTargetsError,
  onDeliveryTargetsRetry,
}: EnvironmentCreateWizardProps) {
  const {
    control,
    trigger,
    getValues,
    formState: { errors },
  } = form;
  const [currentStep, setCurrentStep] = useState(0);

  const stepItems = useMemo(
    () => [
      {
        title: 'Basics',
        description: 'Name the environment and add optional context.',
      },
      {
        title: 'Source',
        description: 'Connect the GitOps repository and manifest path.',
      },
      {
        title: 'Deployment',
        description: 'Select a placement target and set an optional expiration.',
      },
      {
        title: 'Review',
        description: 'Confirm values before creating the environment.',
      },
    ],
    [],
  );

  const nextStep = async () => {
    const fields = stepFields[currentStep];
    if (!fields) {
      return;
    }

    const isValid = await trigger(fields);
    if (isValid) {
      setCurrentStep((step) => step + 1);
    }
  };

  const previousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const values = getValues();

  const reviewDisplays = useMemo(() => {
    const selectedVersion = templateVersions?.find((v) => v.id === values.templateVersionId);
    const selectedTemplate = templates?.find((t) => t.id === selectedVersion?.templateId);
    const selectedTarget = deliveryTargets?.find((t) => t.id === values.deliveryTargetId);
    return {
      templateDisplay: selectedTemplate?.name,
      versionDisplay: selectedVersion?.version,
      deliveryTargetDisplay: selectedTarget?.displayName,
    };
  }, [templateVersions, templates, deliveryTargets, values.templateVersionId, values.deliveryTargetId]);

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <SectionCard
        title="Guided setup"
        description="Progress through each section to define deployment details, validate the source, and review the final configuration."
      >
        <Steps current={currentStep} items={stepItems} responsive />
      </SectionCard>

      {submitError ? (
        <Alert
          type="error"
          showIcon
          message={
            submitError.kind === 'validation'
              ? 'Please fix the highlighted fields'
              : submitError.kind === 'forbidden'
                ? 'Access denied'
                : submitError.kind === 'conflict'
                  ? 'Resource conflict'
                  : submitError.kind === 'unauthorized'
                    ? 'Session expired'
                    : 'Failed to create environment'
          }
          description={
            <Space direction="vertical" size={4}>
              <span>{submitError.message}</span>
              {submitError.retryable && submitError.kind !== 'validation' ? (
                <Text type="secondary">You can retry this operation.</Text>
              ) : null}
              {submitError.kind === 'forbidden' ? (
                <Text type="secondary">Contact your administrator if you believe this is an error.</Text>
              ) : null}
            </Space>
          }
        />
      ) : null}

      <SectionCard bodyStyle={{ padding: 28 }}>
        <Form layout="vertical" onFinish={onSubmit}>
          {currentStep === 0 ? <BasicsStep control={control} errors={errors} /> : null}
          {currentStep === 1 ? <SourceStep control={control} errors={errors} /> : null}
          {currentStep === 2 ? (
            <DeploymentStep
              control={control}
              errors={errors}
              templates={templates}
              templatesLoading={templatesLoading}
              templatesError={templatesError}
              onTemplatesRetry={onTemplatesRetry}
              templateVersions={templateVersions}
              templateVersionsLoading={templateVersionsLoading}
              onTemplateIdChange={onTemplateIdChange}
              selectedTemplateId={selectedTemplateId}
              deliveryTargets={deliveryTargets}
              deliveryTargetsLoading={deliveryTargetsLoading}
              deliveryTargetsError={deliveryTargetsError}
              onDeliveryTargetsRetry={onDeliveryTargetsRetry}
            />
          ) : null}
          {currentStep === 3 ? <ReviewStep values={values} {...reviewDisplays} /> : null}

          <div
            style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: '1px solid #eef2f7',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <Button htmlType="button" onClick={currentStep === 0 ? onCancel : previousStep}>
              {currentStep === 0 ? 'Cancel' : 'Back'}
            </Button>
            <Space>
              <Text type="secondary">Step {currentStep + 1} of {stepItems.length}</Text>
              {currentStep < stepItems.length - 1 ? (
                <Button type="primary" htmlType="button" onClick={() => void nextStep()}>
                  Continue
                </Button>
              ) : (
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                  Create environment
                </Button>
              )}
            </Space>
          </div>
        </Form>
      </SectionCard>
    </Space>
  );
}

interface StepProps {
  control: UseFormReturn<CreateEnvironmentRequest>['control'];
  errors: FieldErrors<CreateEnvironmentRequest>;
}

function StepHeader({ title, description }: { title: string; description: string }) {
  return (
    <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: 20 }}>
      <Title level={4} style={{ margin: 0 }}>
        {title}
      </Title>
      <Text type="secondary">{description}</Text>
    </Space>
  );
}

function BasicsStep({ control, errors }: StepProps) {
  return (
    <>
      <StepHeader title="Basic details" description="Provide the main environment identity and optional context for operators and teammates." />
      <Row gutter={20}>
        <Col xs={24} lg={12}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Form.Item label="Environment name" validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
                <Input {...field} placeholder="payments-dev" />
              </Form.Item>
            )}
          />
        </Col>
        <Col xs={24} lg={12}>
          <div
            style={{
              height: '100%',
              padding: 18,
              borderRadius: 18,
              background: '#f8fbff',
              border: '1px solid #e6edf7',
            }}
          >
            <Text strong>Tip</Text>
            <br />
            <Text type="secondary">Use a short, searchable name that matches the service or team context this environment belongs to.</Text>
          </div>
        </Col>
      </Row>

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Form.Item label="Description" validateStatus={errors.description ? 'error' : ''} help={errors.description?.message}>
            <Input.TextArea {...field} rows={4} placeholder="Optional summary for teammates and operators" />
          </Form.Item>
        )}
      />
    </>
  );
}

function SourceStep({ control, errors }: StepProps) {
  return (
    <>
      <StepHeader title="Source configuration" description="Connect the GitOps source and specify which path and revision should drive the deployment." />
      <Controller
        name="gitRepoUrl"
        control={control}
        render={({ field }) => (
          <Form.Item label="Git repository URL" validateStatus={errors.gitRepoUrl ? 'error' : ''} help={errors.gitRepoUrl?.message}>
            <Input {...field} placeholder="https://github.com/org/repo.git" />
          </Form.Item>
        )}
      />

      <Row gutter={20}>
        <Col xs={24} lg={12}>
          <Controller
            name="manifestPath"
            control={control}
            render={({ field }) => (
              <Form.Item label="Manifest path" validateStatus={errors.manifestPath ? 'error' : ''} help={errors.manifestPath?.message}>
                <Input {...field} placeholder="deploy/overlays/dev" />
              </Form.Item>
            )}
          />
        </Col>
        <Col xs={24} lg={12}>
          <Controller
            name="gitRevision"
            control={control}
            render={({ field }) => (
              <Form.Item label="Git revision" validateStatus={errors.gitRevision ? 'error' : ''} help={errors.gitRevision?.message}>
                <Input {...field} placeholder="main" />
              </Form.Item>
            )}
          />
        </Col>
      </Row>
    </>
  );
}

interface DeploymentStepProps extends StepProps {
  templates?: TemplateSummary[];
  templatesLoading?: boolean;
  templatesError?: boolean;
  onTemplatesRetry?: () => void;
  templateVersions?: TemplateVersion[];
  templateVersionsLoading?: boolean;
  onTemplateIdChange?: (id: string) => void;
  selectedTemplateId?: string;
  deliveryTargets?: DeliveryTarget[];
  deliveryTargetsLoading?: boolean;
  deliveryTargetsError?: boolean;
  onDeliveryTargetsRetry?: () => void;
}

function DeploymentStep({
  control,
  errors,
  templates,
  templatesLoading,
  templatesError,
  onTemplatesRetry,
  templateVersions,
  templateVersionsLoading,
  onTemplateIdChange,
  selectedTemplateId,
  deliveryTargets,
  deliveryTargetsLoading,
  deliveryTargetsError,
  onDeliveryTargetsRetry,
}: DeploymentStepProps) {
  const watchedTemplateVersionId = useWatch({ control, name: 'templateVersionId' });

  const templateOptions = useMemo(() => {
    const items = templates ?? [];
    return items.map((t) => ({ label: t.name, value: t.id }));
  }, [templates]);

  const versionOptions = useMemo(() => {
    const items = templateVersions ?? [];
    return items.map((v) => ({ label: v.version, value: v.id }));
  }, [templateVersions]);

  const selectedVersion = useMemo(() => {
    if (!templateVersions || !watchedTemplateVersionId) return undefined;
    return templateVersions.find((v) => v.id === watchedTemplateVersionId);
  }, [templateVersions, watchedTemplateVersionId]);

  const targetOptions = useMemo(() => {
    const items = deliveryTargets ?? [];
    return items.map((t) => ({
      label: `${t.displayName}${t.availabilityState !== 'available' ? ' (unavailable)' : ''}`,
      value: t.id,
      disabled: t.availabilityState !== 'available',
    }));
  }, [deliveryTargets]);

  return (
    <>
      <StepHeader title="Deployment settings" description="Choose optional template context, a placement target, and lifetime constraints for the new environment." />

      {templatesError ? (
        <Alert
          type="error"
          showIcon
          message="Failed to load templates"
          action={onTemplatesRetry ? <Button size="small" onClick={onTemplatesRetry}>Retry</Button> : undefined}
          style={{ marginBottom: 16 }}
        />
      ) : null}

      <Row gutter={20}>
        <Col xs={24} lg={12}>
          <Controller
            name="templateVersionId"
            control={control}
            render={({ field }) => (
              <Form.Item label="Template" help="Optional. Select a template and version to pre-configure the environment.">
                <Select
                  loading={templatesLoading}
                  placeholder="Select a template"
                  options={templateOptions}
                  allowClear
                  notFoundContent={templatesLoading ? 'Loading templates...' : 'No templates available'}
                  value={selectedTemplateId || undefined}
                  onChange={(templateId: string | undefined) => {
                    if (!templateId) {
                      field.onChange('');
                      onTemplateIdChange?.('');
                      return;
                    }
                    onTemplateIdChange?.(templateId);
                  }}
                />
              </Form.Item>
            )}
          />
        </Col>
        <Col xs={24} lg={12}>
          <Controller
            name="templateVersionId"
            control={control}
            render={({ field }) => (
              <Form.Item label="Template version" help="Select the version to use.">
                <Select
                  {...field}
                  loading={templateVersionsLoading}
                  placeholder="Select a version"
                  options={versionOptions}
                  allowClear
                  notFoundContent={templateVersionsLoading ? 'Loading versions...' : 'Select a template first'}
                  value={field.value || undefined}
                  onChange={field.onChange}
                />
              </Form.Item>
            )}
          />
        </Col>
      </Row>

      {selectedVersion?.parameters && selectedVersion.parameters.length > 0 ? (
        <Controller
          name="templateInputs"
          control={control}
          render={({ field }) => (
            <Row gutter={20}>
              {selectedVersion.parameters!.map((param) => (
                <Col key={param.name} xs={24} lg={12}>
                  <Form.Item
                    label={param.displayName}
                    required={param.required}
                    help={param.validation?.pattern ? `Pattern: ${param.validation.pattern}` : undefined}
                  >
                    <Input
                      placeholder={param.defaultValue ?? param.displayName}
                      value={field.value?.[param.name] ?? ''}
                      onChange={(e) => field.onChange({ ...field.value, [param.name]: e.target.value })}
                    />
                  </Form.Item>
                </Col>
              ))}
            </Row>
          )}
        />
      ) : null}

      <Title level={5} style={{ marginTop: 16, marginBottom: 12 }}>Placement</Title>

      {deliveryTargetsError ? (
        <Alert
          type="error"
          showIcon
          message="Failed to load delivery targets"
          action={onDeliveryTargetsRetry ? <Button size="small" onClick={onDeliveryTargetsRetry}>Retry</Button> : undefined}
          style={{ marginBottom: 16 }}
        />
      ) : null}

      <Row gutter={20}>
        <Col xs={24} lg={12}>
          <Controller
            name="deliveryTargetId"
            control={control}
            render={({ field }) => (
              <Form.Item label="Delivery target" validateStatus={errors.deliveryTargetId ? 'error' : ''} help={errors.deliveryTargetId?.message ?? 'Optional. Select a placement target for this environment.'}>
                <Select
                  {...field}
                  loading={deliveryTargetsLoading}
                  placeholder="Select a delivery target"
                  options={targetOptions}
                  allowClear
                  notFoundContent={deliveryTargetsLoading ? 'Loading targets...' : 'No delivery targets available'}
                  value={field.value || undefined}
                  onChange={field.onChange}
                />
              </Form.Item>
            )}
          />
        </Col>
        <Col xs={24} lg={12}>
          <Controller
            name="expiresAt"
            control={control}
            render={({ field }) => (
              <Form.Item label="Expires at" validateStatus={errors.expiresAt ? 'error' : ''} help={errors.expiresAt?.message ?? 'Optional. Select a date and time for the environment to expire.'}>
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  placeholder="Select expiration date"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(d: Dayjs | null) => field.onChange(d ? d.toISOString() : '')}
                />
              </Form.Item>
            )}
          />
        </Col>
      </Row>
    </>
  );
}

function ReviewStep({ values, templateDisplay, versionDisplay, deliveryTargetDisplay }: {
  values: CreateEnvironmentRequest;
  templateDisplay?: string;
  versionDisplay?: string;
  deliveryTargetDisplay?: string;
}) {
  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <StepHeader title="Review configuration" description="Confirm the submitted values before the environment is created." />
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <ReviewCard
            title="Basics"
            rows={[
              ['Environment name', values.name],
              ['Description', values.description],
            ]}
          />
        </Col>
        <Col xs={24} lg={12}>
          <ReviewCard
            title="Source"
            rows={[
              ['Git repository URL', values.gitRepoUrl],
              ['Manifest path', values.manifestPath],
              ['Git revision', values.gitRevision],
            ]}
          />
        </Col>
        <Col xs={24} lg={12}>
          <ReviewCard
            title="Deployment"
            rows={[
              ['Template', templateDisplay],
              ['Template version', versionDisplay],
              ['Delivery target', deliveryTargetDisplay],
              ['Expires at', values.expiresAt ? dayjs(values.expiresAt).format('YYYY-MM-DD HH:mm:ss') : undefined],
            ]}
          />
        </Col>
      </Row>
    </Space>
  );
}

function ReviewCard({ title, rows }: { title: string; rows: Array<[string, string | undefined]> }) {
  return (
    <div
      style={{
        height: '100%',
        padding: 18,
        borderRadius: 18,
        background: '#f8fbff',
        border: '1px solid #e6edf7',
      }}
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Text strong>{title}</Text>
        {rows.map(([label, value]) => (
          <div key={label}>
            <Text strong>{label}</Text>
            <br />
            <Text type={value ? undefined : 'secondary'}>{value || 'Not provided'}</Text>
          </div>
        ))}
      </Space>
    </div>
  );
}

export default EnvironmentCreateWizard;
