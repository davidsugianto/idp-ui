import { useNavigate } from 'react-router-dom';
import { Layout, Grid, Avatar, Dropdown, Space, Typography, Button, theme } from 'antd';
import { LogoutOutlined, SettingOutlined, MenuOutlined, GlobalOutlined, SearchOutlined, QuestionCircleOutlined, GithubOutlined } from '@ant-design/icons';
import type { CSSProperties } from 'react';
import type { MenuProps } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { useUiStore } from '@/stores/uiStore';

const { Header: AntHeader } = Layout;

function Header() {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: user?.name || user?.email || 'User',
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: () => logout(),
    },
  ];

  const iconButtonStyle: CSSProperties = {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'transparent',
    border: 'none',
    color: token.colorTextSecondary,
    boxShadow: 'none',
  };

  return (
    <AntHeader
      style={{
        background: token.colorBgContainer,
        padding: isMobile ? '0 12px' : '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: 'none',
        height: 56,
        lineHeight: 'normal',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Space size={12} align="center" style={{ minWidth: 0, flex: 1 }}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={toggleSidebar}
          aria-label="Toggle navigation"
          style={{
            ...iconButtonStyle,
            display: isMobile ? 'inline-flex' : 'none',
            color: token.colorText,
          }}
        />
        <Space
          size={10}
          align="center"
          style={{ minWidth: 0, cursor: isMobile ? 'default' : 'pointer' }}
          onClick={isMobile ? undefined : toggleSidebar}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
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
                width: 14,
                height: 14,
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
          <Typography.Text
            strong
            style={{
              fontSize: 16,
              whiteSpace: 'nowrap',
              color: token.colorText,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            Developer Portal
          </Typography.Text>
        </Space>
      </Space>

      <Space size={4} align="center" style={{ marginLeft: 12 }}>
        <Button type="text" icon={<SearchOutlined />} aria-label="Search" style={iconButtonStyle} />
        <Button type="text" icon={<QuestionCircleOutlined />} aria-label="Help" style={iconButtonStyle} />
        <Button type="text" icon={<GithubOutlined />} aria-label="Repository" style={iconButtonStyle} />
        <Button type="text" icon={<GlobalOutlined />} aria-label="Language" style={iconButtonStyle} />
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
          <Space
            size={8}
            style={{
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              minWidth: 0,
            }}
          >
            <Avatar size={28} style={{ background: '#91caff', color: '#0958d9', flexShrink: 0 }}>
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </Avatar>
            {!isMobile ? (
              <Typography.Text style={{ fontSize: 14, color: token.colorTextSecondary }}>
                {user?.name || 'User'}
              </Typography.Text>
            ) : null}
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}

export default Header;
