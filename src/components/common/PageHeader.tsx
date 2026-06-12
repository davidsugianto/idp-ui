import type { ReactNode } from 'react';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface PageHeaderAction {
  key: string;
  label: ReactNode;
  onClick?: () => void;
  href?: string;
  type?: 'primary' | 'default';
  ghost?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: PageHeaderAction[];
  extra?: ReactNode;
  compact?: boolean;
  onBack?: () => void;
}

function PageHeader({ eyebrow, title, description, actions, extra, compact = false, onBack }: PageHeaderProps) {
  return (
    <Card
      bodyStyle={{ padding: compact ? 20 : 24 }}
      style={{
        borderRadius: 20,
        border: '1px solid #f0f0f0',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
      }}
    >
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col flex="auto">
          <Space direction="vertical" size={eyebrow || description ? 6 : 0} style={{ width: '100%' }}>
            {eyebrow ? (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  color: '#1677ff',
                }}
              >
                {eyebrow}
              </Text>
            ) : null}
            <Space align="center">
              {onBack ? (
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  onClick={onBack}
                  style={{ padding: 0 }}
                />
              ) : null}
              <Title level={2} style={{ margin: 0 }}>
                {title}
              </Title>
            </Space>
            {description ? <Text type="secondary">{description}</Text> : null}
          </Space>
        </Col>
        {actions?.length || extra ? (
          <Col>
            <Space wrap align="center" style={{ justifyContent: 'flex-end' }}>
              {extra}
              {actions?.map((action) => (
                <Button
                  key={action.key}
                  type={action.type ?? 'default'}
                  ghost={action.ghost}
                  loading={action.loading}
                  disabled={action.disabled}
                  onClick={action.onClick}
                  href={action.href}
                >
                  {action.label}
                </Button>
              ))}
            </Space>
          </Col>
        ) : null}
      </Row>
    </Card>
  );
}

export default PageHeader;
