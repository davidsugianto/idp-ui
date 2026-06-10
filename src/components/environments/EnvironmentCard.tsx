import { Button, Card, Space, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import type { Environment } from '@/types/environment';

const { Text, Title } = Typography;

const statusColors: Record<Environment['status'], string> = {
  active: 'green',
  inactive: 'default',
  creating: 'blue',
  deleting: 'orange',
  error: 'red',
};

interface EnvironmentCardProps {
  environment: Environment;
  onSync?: (id: string) => void;
  syncing?: boolean;
}

function EnvironmentCard({ environment, onSync, syncing = false }: EnvironmentCardProps) {
  return (
    <Card hoverable>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }} align="start">
          <div>
            <Title level={4} style={{ margin: 0 }}>
              <Link to={`/environments/${environment.id}`}>{environment.name}</Link>
            </Title>
            <Text type="secondary">{environment.namespace}</Text>
          </div>
          <Tag color={statusColors[environment.status]}>{environment.status.toUpperCase()}</Tag>
        </Space>
        <Space size="large" wrap>
          <Text>Team: {environment.teamId}</Text>
          <Text>Cluster: {environment.clusterName || 'Unassigned'}</Text>
          <Text>Git: {environment.gitRevision}</Text>
          <Text>Last sync: {environment.lastSyncAt || 'Never'}</Text>
        </Space>
        {environment.description ? <Text type="secondary">{environment.description}</Text> : null}
        <Space wrap>
          <Button type="link" style={{ paddingInline: 0 }}>
            <Link to={`/environments/${environment.id}`}>View Details</Link>
          </Button>
          {onSync ? (
            <Button onClick={() => onSync(environment.id)} loading={syncing}>
              Sync Now
            </Button>
          ) : null}
        </Space>
      </Space>
    </Card>
  );
}

export default EnvironmentCard;
