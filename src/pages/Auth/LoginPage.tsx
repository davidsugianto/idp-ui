import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Alert, Button, Card, Divider, Form, Input, Space, Typography } from 'antd';
import { ArrowRightOutlined, LockOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import CallbackPage from './CallbackPage';

const { Title, Text } = Typography;

function PortalMark() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 10,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: 'linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%)',
        border: '1px solid #d6e4ff',
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          position: 'relative',
          transform: 'rotate(45deg)',
          borderRadius: 3,
          border: '2px solid #1677ff',
          boxSizing: 'border-box',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#ff7875',
            top: -3,
            left: -3,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#69b1ff',
            right: -3,
            bottom: -3,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#1677ff',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </div>
  );
}

interface LoginFormValues {
  username: string;
  password: string;
}

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, loginWithOidc, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hasOidcCallbackParams =
    searchParams.has('auth_token') ||
    searchParams.has('access_token') ||
    searchParams.has('error');
  const from = (location.state as { from?: string })?.from;
  const targetPath = from && from !== '/auth/login' && from !== '/auth/callback' ? from : '/';

  useEffect(() => {
    if (isAuthenticated && !hasOidcCallbackParams) {
      navigate(targetPath, { replace: true });
    }
  }, [hasOidcCallbackParams, isAuthenticated, navigate, targetPath]);

  if (hasOidcCallbackParams) {
    return <CallbackPage />;
  }

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await login(values.username, values.password);
      navigate(targetPath, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #eef4ff 52%, #f8fbff 100%)',
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1180,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(360px, 440px)',
          gap: 20,
        }}
      >
        <div
          style={{
            minHeight: 680,
            padding: '40px clamp(24px, 5vw, 56px)',
            borderRadius: 32,
            background: 'linear-gradient(145deg, #0f172a 0%, #1d4ed8 58%, #60a5fa 100%)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 32px 70px rgba(15, 23, 42, 0.16)',
          }}
        >
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <Space size={12} align="center">
              <PortalMark />
              <Space direction="vertical" size={2}>
                <Text style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Developer Portal</Text>
                <Text style={{ color: 'rgba(255,255,255,0.72)' }}>Platform administration</Text>
              </Space>
            </Space>
            <Space direction="vertical" size={14}>
              <Text style={{ color: 'rgba(255,255,255,0.72)', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                Developer platform portal
              </Text>
              <Title level={1} style={{ margin: 0, color: '#fff', maxWidth: 560 }}>
                OIDC-first access for platform operations
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, maxWidth: 560 }}>
                Sign in once to manage environments, review platform health, and coordinate administrative workflows from a single workspace.
              </Text>
            </Space>
          </Space>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 14,
            }}
          >
            {[
              {
                title: 'Secure sign-in',
                text: 'OIDC remains the primary authentication path for the portal.',
              },
              {
                title: 'Unified workspace',
                text: 'Jump from the overview to environments, settings, and admin tools.',
              },
              {
                title: 'Operational visibility',
                text: 'Keep recent activity, audit workflows, and platform signals in one flow.',
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: 18,
                  borderRadius: 20,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <Text style={{ display: 'block', color: '#fff', fontWeight: 700, marginBottom: 6 }}>{item.title}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.72)' }}>{item.text}</Text>
              </div>
            ))}
          </div>
        </div>

        <Card
          bodyStyle={{ padding: 32 }}
          style={{
            borderRadius: 32,
            boxShadow: '0 28px 60px rgba(15, 23, 42, 0.1)',
            border: '1px solid #e6edf7',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Text style={{ color: '#1677ff', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                Welcome back
              </Text>
              <Title level={2} style={{ margin: 0 }}>
                Sign in to Developer Portal
              </Title>
              <Text type="secondary">
                Continue with your organization account through OIDC, or use credentials when required for local access.
              </Text>
            </Space>

            <Button type="primary" size="large" block icon={<SafetyCertificateOutlined />} onClick={() => loginWithOidc(targetPath)}>
              Continue with OIDC
            </Button>

            <div
              style={{
                padding: 16,
                borderRadius: 18,
                background: '#f5f7fa',
                border: '1px solid #e6edf7',
              }}
            >
              <Space align="start" size={12}>
                <ArrowRightOutlined style={{ color: '#1677ff', marginTop: 4 }} />
                <Space direction="vertical" size={4}>
                  <Text strong>Preferred sign-in route</Text>
                  <Text type="secondary">Use the OIDC button above for the standard production-style authentication flow.</Text>
                </Space>
              </Space>
            </div>

            <Divider plain>
              <Text type="secondary">or use credentials</Text>
            </Divider>

            {error ? <Alert message={error} type="error" showIcon closable onClose={() => setError(null)} /> : null}

            <Form<LoginFormValues>
              name="login"
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
              autoComplete="off"
            >
              <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter your username' }]}>
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>

              <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter your password' }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>

              <Form.Item style={{ marginBottom: 12 }}>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Sign in with credentials
                </Button>
              </Form.Item>
            </Form>

            <Text type="secondary" style={{ textAlign: 'center' }}>
              You will be redirected back to your previous destination after a successful sign-in.
            </Text>
          </Space>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
