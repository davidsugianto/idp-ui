import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, Layout, Menu, theme } from 'antd';
import { AimOutlined, AppstoreOutlined, CloudServerOutlined, DashboardOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuthStore } from '@/stores/authStore';

const { Sider } = Layout;

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  isMobile?: boolean;
}

function Sidebar({ collapsed = false, onCollapse, isMobile = false }: SidebarProps) {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.roles.includes('admin') ?? false;
  const isDesktopCollapsed = collapsed && !isMobile;
  const isDrawerOpen = !collapsed;

  const menuItems = useMemo<MenuProps['items']>(
    () => [
      {
        key: '/',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
      },
      {
        key: '/environments',
        icon: <CloudServerOutlined />,
        label: 'Environments',
      },
      {
        key: '/templates',
        icon: <AppstoreOutlined />,
        label: 'Templates',
      },
      {
        key: '/delivery-targets',
        icon: <AimOutlined />,
        label: 'Delivery Targets',
      },
      ...(isAdmin
        ? [
            {
              key: '/admin',
              icon: <TeamOutlined />,
              label: 'Admin',
            },
          ]
        : []),
      {
        key: '/settings',
        icon: <SettingOutlined />,
        label: 'Settings',
      },
    ],
    [isAdmin],
  );

  const currentKey = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const root = segments[0] ? `/${segments[0]}` : '/';
    return root === '/auth' ? '/' : root;
  }, [location.pathname]);

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: token.colorBgContainer }}>
      <div style={{ flex: 1, padding: isDesktopCollapsed ? '16px 4px 12px' : '16px 8px 12px' }}>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[currentKey]}
          items={menuItems}
          style={{ borderInlineEnd: 0, background: 'transparent', color: token.colorText, fontSize: 14 }}
          onClick={({ key }) => {
            navigate(key === '/dashboard' ? '/' : key);
            if (isMobile) {
              onCollapse?.(true);
            }
          }}
        />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        open={isDrawerOpen}
        onClose={() => onCollapse?.(true)}
        closable={false}
        width={232}
        bodyStyle={{ padding: 0, background: token.colorBgContainer }}
        styles={{
          header: { display: 'none' },
          content: { background: token.colorBgContainer, borderRight: `1px solid ${token.colorBorderSecondary}` },
          body: { padding: 0, background: token.colorBgContainer },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Sider
      collapsedWidth={64}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      trigger={null}
      width={232}
      style={{
        background: token.colorBgContainer,
        borderRight: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: 'none',
      }}
    >
      {sidebarContent}
    </Sider>
  );
}

export default Sidebar;
