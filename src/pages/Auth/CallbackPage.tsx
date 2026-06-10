import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Space, Spin, Typography } from 'antd';
import AppResultPage from '@/components/common/AppResultPage';
import SectionCard from '@/components/common/SectionCard';
import { useAuth } from '@/hooks/useAuth';
import { parseOidcState } from '@/services/oidc';

const { Text, Title } = Typography;

function CallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeLogin, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authToken = searchParams.get('auth_token') || searchParams.get('access_token');
    const expiresIn = searchParams.get('expires_in');
    const userIdParam = searchParams.get('user_id');
    const emailParam = searchParams.get('email');
    const isAdminParam = searchParams.get('is_admin');
    const stateParam = searchParams.get('state');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(searchParams.get('error_description') || 'Authentication failed');
      return;
    }

    if (!authToken) {
      navigate('/', { replace: true });
      return;
    }

    void (async () => {
      try {
        await completeLogin({
          authToken,
          expiresIn: Number(expiresIn) || 300,
          refreshToken: searchParams.get('refresh_token') || undefined,
          tokenType: searchParams.get('token_type') || undefined,
          userId: userIdParam || undefined,
          email: emailParam || undefined,
          isAdmin: isAdminParam === 'true',
        });
        navigate(parseOidcState(stateParam), { replace: true });
      } catch (err: unknown) {
        await logout();
        setError(err instanceof Error ? err.message : 'Failed to complete sign in');
      }
    })();
  }, [searchParams, navigate, completeLogin, logout]);

  if (error) {
    return (
      <AppResultPage
        status="error"
        eyebrow="Authentication error"
        title="Sign-in could not be completed"
        subTitle={error}
        hint="Retry the OIDC flow or return to the login screen to start over."
        extra={
          <Button type="primary" onClick={() => navigate('/auth/login')}>
            Back to login
          </Button>
        }
      />
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: 'linear-gradient(180deg, #f5f7fa 0%, #eef4ff 100%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 560 }}>
        <SectionCard bodyStyle={{ padding: 36 }}>
          <Space direction="vertical" size={20} style={{ width: '100%', textAlign: 'center' }}>
            <Spin size="large" />
            <Space direction="vertical" size={8}>
              <Text style={{ color: '#1677ff', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                Completing sign-in
              </Text>
              <Title level={3} style={{ margin: 0 }}>
                Preparing your workspace
              </Title>
              <Text type="secondary">
                We’re validating your OIDC session and redirecting you back to the requested destination.
              </Text>
            </Space>
          </Space>
        </SectionCard>
      </div>
    </div>
  );
}

export default CallbackPage;
