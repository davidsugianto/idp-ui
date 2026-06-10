import type { ReactNode } from 'react';
import { Button, Result, Space, Typography } from 'antd';

const { Text } = Typography;

interface AppResultPageProps {
  status: '403' | '404' | '500' | 'error' | 'info' | 'success' | 'warning';
  title: string;
  subTitle: string;
  extra?: ReactNode;
  eyebrow?: string;
  hint?: string;
}

function AppResultPage({ status, title, subTitle, extra, eyebrow, hint }: AppResultPageProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        background: 'linear-gradient(180deg, #f5f7fa 0%, #eef4ff 100%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 760 }}>
        <div
          style={{
            padding: 12,
            borderRadius: 28,
            background: 'rgba(255,255,255,0.92)',
            boxShadow: '0 28px 60px rgba(15, 23, 42, 0.08)',
            border: '1px solid #e6edf7',
          }}
        >
          <Result status={status} title={title} subTitle={subTitle} extra={extra}>
            <Space direction="vertical" size={8} style={{ width: '100%', textAlign: 'center' }}>
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
              {hint ? <Text type="secondary">{hint}</Text> : null}
            </Space>
          </Result>
        </div>
      </div>
    </div>
  );
}

export function ResultAction({ label, onClick, href, type = 'primary' }: { label: string; onClick?: () => void; href?: string; type?: 'primary' | 'default'; }) {
  return (
    <Button type={type} onClick={onClick} href={href}>
      {label}
    </Button>
  );
}

export default AppResultPage;
