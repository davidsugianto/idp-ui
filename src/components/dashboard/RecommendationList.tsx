import { List, Skeleton, Space, Tag, Typography } from 'antd';
import SectionCard from '@/components/common/SectionCard';
import type { DashboardRecommendation } from '@/types/dashboard';

const { Text } = Typography;

interface RecommendationListProps {
  recommendations: DashboardRecommendation[];
  loading?: boolean;
}

function RecommendationList({ recommendations, loading = false }: RecommendationListProps) {
  return (
    <SectionCard
      title="Recommendations"
      description="Review follow-up actions and platform guidance generated from recent activity."
      style={{ height: '100%' }}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <List
          locale={{ emptyText: <Text type="secondary">No recommendations available.</Text> }}
          dataSource={recommendations}
          renderItem={(item) => (
            <List.Item style={{ paddingInline: 0 }}>
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <Space size={8} wrap>
                  <Text strong>{item.title}</Text>
                  {item.impact ? <Tag>{item.impact}</Tag> : null}
                </Space>
                <Text type="secondary">{item.description || item.impact || 'No further details available.'}</Text>
              </Space>
            </List.Item>
          )}
        />
      )}
    </SectionCard>
  );
}

export default RecommendationList;
