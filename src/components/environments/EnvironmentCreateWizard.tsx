import { Alert, Button, Col, DatePicker, Form, Input, Row, Space, Steps, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { Controller, type FieldErrors, type FieldPath, type UseFormReturn } from 'react-hook-form';
import SectionCard from '@/components/common/SectionCard';
import type { CreateEnvironmentRequest } from '@/types/environment';

const { Text, Title } = Typography;

interface EnvironmentCreateWizardProps {
  form: UseFormReturn<CreateEnvironmentRequest>;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

const stepFields: Array<FieldPath<CreateEnvironmentRequest>[]> = [
  ['name', 'description'],
  ['gitRepoUrl', 'manifestPath', 'gitRevision'],
  ['clusterName', 'resourceQuotaCpu', 'resourceQuotaMemory', 'expiresAt'],
];

function EnvironmentCreateWizard({ form, onSubmit, onCancel, isSubmitting = false, submitError }: EnvironmentCreateWizardProps) {
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
        description: 'Set cluster and optional quota or expiration details.',
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

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <SectionCard
        title="Guided setup"
        description="Progress through each section to define deployment details, validate the source, and review the final configuration."
      >
        <Steps current={currentStep} items={stepItems} responsive />
      </SectionCard>

      {submitError ? <Alert type="error" showIcon message="Failed to create environment" description={submitError} /> : null}

      <SectionCard bodyStyle={{ padding: 28 }}>
        <Form layout="vertical" onFinish={onSubmit}>
          {currentStep === 0 ? <BasicsStep control={control} errors={errors} /> : null}
          {currentStep === 1 ? <SourceStep control={control} errors={errors} /> : null}
          {currentStep === 2 ? <DeploymentStep control={control} errors={errors} /> : null}
          {currentStep === 3 ? <ReviewStep values={values} /> : null}

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
            <Button onClick={currentStep === 0 ? onCancel : previousStep}>
              {currentStep === 0 ? 'Cancel' : 'Back'}
            </Button>
            <Space>
              <Text type="secondary">Step {currentStep + 1} of {stepItems.length}</Text>
              {currentStep < stepItems.length - 1 ? (
                <Button type="primary" onClick={() => void nextStep()}>
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

function DeploymentStep({ control, errors }: StepProps) {
  return (
    <>
      <StepHeader title="Deployment settings" description="Choose the target cluster and add optional quota or lifetime constraints for the new environment." />
      <Controller
        name="clusterName"
        control={control}
        render={({ field }) => (
          <Form.Item label="Cluster name" validateStatus={errors.clusterName ? 'error' : ''} help={errors.clusterName?.message}>
            <Input {...field} placeholder="prod-us-east" />
          </Form.Item>
        )}
      />

      <Row gutter={20}>
        <Col xs={24} lg={8}>
          <Controller
            name="resourceQuotaCpu"
            control={control}
            render={({ field }) => (
              <Form.Item label="CPU quota" validateStatus={errors.resourceQuotaCpu ? 'error' : ''} help={errors.resourceQuotaCpu?.message}>
                <Input {...field} placeholder="500m" />
              </Form.Item>
            )}
          />
        </Col>
        <Col xs={24} lg={8}>
          <Controller
            name="resourceQuotaMemory"
            control={control}
            render={({ field }) => (
              <Form.Item label="Memory quota" validateStatus={errors.resourceQuotaMemory ? 'error' : ''} help={errors.resourceQuotaMemory?.message}>
                <Input {...field} placeholder="512Mi" />
              </Form.Item>
            )}
          />
        </Col>
        <Col xs={24} lg={8}>
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

function ReviewStep({ values }: { values: CreateEnvironmentRequest }) {
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
              ['Cluster name', values.clusterName],
              ['CPU quota', values.resourceQuotaCpu],
              ['Memory quota', values.resourceQuotaMemory],
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
