import { Card, Skeleton, Space, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  loading?: boolean;
  change?: number;
  changeLabel?: string;
  footer?: string;
}

function StatCard({ title, value, prefix, suffix, loading = false, change, changeLabel, footer }: StatCardProps) {
  const isUp = change !== undefined && change >= 0;

  return (
    <Card
      bodyStyle={{ padding: '20px 24px' }}
      style={{
        height: '100%',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 1, width: ['40%'] }} title={{ width: '55%' }} />
      ) : (
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            {title}
          </Typography.Text>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <Typography.Text style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
              {prefix}
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography.Text>
            {suffix ? (
              <Typography.Text type="secondary" style={{ fontSize: 16 }}>
                {suffix}
              </Typography.Text>
            ) : null}
          </div>
          {change !== undefined ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: isUp ? '#52c41a' : '#ff4d4f', fontSize: 13, fontWeight: 600 }}>
                {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(change)}%
              </span>
              {changeLabel ? (
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  {changeLabel}
                </Typography.Text>
              ) : null}
            </div>
          ) : null}
          {footer ? (
            <div
              style={{
                marginTop: 4,
                paddingTop: 12,
                borderTop: '1px solid #f0f0f0',
              }}
            >
              <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                {footer}
              </Typography.Text>
            </div>
          ) : null}
        </Space>
      )}
    </Card>
  );
}

export default StatCard;