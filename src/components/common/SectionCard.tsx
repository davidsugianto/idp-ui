import type { ReactNode } from 'react';
import { Card, Space, Typography } from 'antd';

const { Title, Text } = Typography;

interface SectionCardProps {
  title?: ReactNode;
  description?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
  bodyStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

function SectionCard({ title, description, extra, children, bodyStyle, style }: SectionCardProps) {
  return (
    <Card
      bodyStyle={{ padding: 24, ...bodyStyle }}
      style={{
        height: '100%',
        borderRadius: 20,
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
        ...style,
      }}
    >
      {title || description || extra ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 20, alignItems: 'flex-start' }}>
          <Space direction="vertical" size={4} style={{ minWidth: 0 }}>
            {title ? (
              <Title level={4} style={{ margin: 0 }}>
                {title}
              </Title>
            ) : null}
            {description ? <Text type="secondary">{description}</Text> : null}
          </Space>
          {extra}
        </div>
      ) : null}
      {children}
    </Card>
  );
}

export default SectionCard;
