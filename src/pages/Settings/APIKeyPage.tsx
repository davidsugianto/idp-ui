import { Alert, Space, Typography } from 'antd';
import { useState } from 'react';
import AsyncState from '@/components/common/AsyncState';
import PageHeader from '@/components/common/PageHeader';
import APIKeyCreateModal from '@/components/settings/APIKeyCreateModal';
import APIKeyList from '@/components/settings/APIKeyList';
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from '@/hooks/useApiKeys';
import type { CreateApiKeyRequest } from '@/types/apiKey';

const { Paragraph } = Typography;

function APIKeyPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [latestSecret, setLatestSecret] = useState<string | null>(null);
  const apiKeysQuery = useApiKeys();
  const createMutation = useCreateApiKey();
  const revokeMutation = useRevokeApiKey();

  const handleCreate = async (values: CreateApiKeyRequest) => {
    const apiKey = await createMutation.mutateAsync(values);
    setLatestSecret(apiKey.secret ?? null);
    setIsCreateModalOpen(false);
  };

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <PageHeader
        eyebrow="Settings"
        title="API keys"
        description="Create and revoke automation credentials for CI/CD and other integrations."
      />

      {latestSecret ? (
        <Alert
          type="success"
          showIcon
          closable
          message="Copy your new API key now"
          description={<Paragraph copyable style={{ marginBottom: 0 }}>{latestSecret}</Paragraph>}
          onClose={() => setLatestSecret(null)}
        />
      ) : null}

      <AsyncState
        isLoading={apiKeysQuery.isLoading}
        error={apiKeysQuery.error instanceof Error ? apiKeysQuery.error : null}
        isEmpty={!apiKeysQuery.isLoading && !apiKeysQuery.data?.length}
        emptyFallback={
          <APIKeyList
            apiKeys={[]}
            onCreate={() => setIsCreateModalOpen(true)}
            onRevoke={() => undefined}
          />
        }
        onRetry={() => void apiKeysQuery.refetch()}
      >
        <APIKeyList
          apiKeys={apiKeysQuery.data ?? []}
          loading={apiKeysQuery.isFetching}
          revokingId={revokeMutation.isPending ? revokeMutation.variables : undefined}
          onCreate={() => setIsCreateModalOpen(true)}
          onRevoke={(id) => revokeMutation.mutate(id)}
        />
      </AsyncState>

      <APIKeyCreateModal
        open={isCreateModalOpen}
        isSubmitting={createMutation.isPending}
        errorMessage={createMutation.error instanceof Error ? createMutation.error.message : null}
        onCancel={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
      />
    </Space>
  );
}

export default APIKeyPage;
