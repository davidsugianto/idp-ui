import { Outlet } from 'react-router-dom';
import { Layout, Grid, theme } from 'antd';
import { useUiStore } from '@/stores/uiStore';
import Header from './Header';
import Sidebar from './Sidebar';

const { Content } = Layout;

function AppLayout() {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const setSidebarCollapsed = useUiStore((s) => s.setSidebarCollapsed);

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
      <Header />
      <Layout style={{ minWidth: 0, background: token.colorBgLayout }}>
        <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} isMobile={isMobile} />
        <Content
          style={{
            padding: isMobile ? '12px 12px 24px' : '20px 20px 28px',
            background: token.colorBgLayout,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '100%',
              margin: '0 auto',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
