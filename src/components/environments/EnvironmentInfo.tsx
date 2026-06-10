import { Descriptions, Tag } from 'antd';
import type { Environment } from '@/types/environment';

const statusColors: Record<Environment['status'], string> = {
  active: 'green',
  inactive: 'default',
  creating: 'blue',
  deleting: 'orange',
  error: 'red',
};

interface EnvironmentInfoProps {
  environment: Environment;
}

function EnvironmentInfo({ environment }: EnvironmentInfoProps) {
  return (
    <Descriptions bordered column={{ xs: 1, md: 2 }} size="middle">
      <Descriptions.Item label="Name">{environment.name}</Descriptions.Item>
      <Descriptions.Item label="Team">{environment.teamId}</Descriptions.Item>
      <Descriptions.Item label="Namespace">{environment.namespace}</Descriptions.Item>
      <Descriptions.Item label="Status">
        <Tag color={statusColors[environment.status]}>{environment.status.toUpperCase()}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Cluster">{environment.clusterName || 'Unassigned'}</Descriptions.Item>
      <Descriptions.Item label="Git repository">{environment.gitRepoUrl}</Descriptions.Item>
      <Descriptions.Item label="Git revision">{environment.gitRevision}</Descriptions.Item>
      <Descriptions.Item label="Manifest path">{environment.manifestPath}</Descriptions.Item>
      <Descriptions.Item label="Description">{environment.description || '—'}</Descriptions.Item>
      <Descriptions.Item label="Last sync">{environment.lastSyncAt || 'Never'}</Descriptions.Item>
      <Descriptions.Item label="Errors">{environment.errorCount}</Descriptions.Item>
      <Descriptions.Item label="Created at">{new Date(environment.createdAt).toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="Updated at">{new Date(environment.updatedAt).toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="Expires at">{environment.expiresAt || '—'}</Descriptions.Item>
    </Descriptions>
  );
}

export default EnvironmentInfo;
