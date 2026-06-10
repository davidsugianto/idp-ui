import type { ThemeConfig } from 'antd';

const shared: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    colorInfo: '#1677ff',
    borderRadius: 10,
    borderRadiusLG: 14,
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,
    lineHeight: 1.5715,
    colorText: '#1f1f1f',
    colorTextSecondary: '#595959',
    colorBorderSecondary: '#f0f0f0',
    colorSplit: '#f0f0f0',
    boxShadowSecondary: '0 6px 18px rgba(0, 0, 0, 0.06)',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#ffffff',
      bodyBg: '#f5f7fa',
      triggerBg: '#ffffff',
    },
    Menu: {
      itemBg: 'transparent',
      itemColor: '#595959',
      itemHoverColor: '#1677ff',
      itemHoverBg: '#f5f7fa',
      itemSelectedBg: '#e6f4ff',
      itemSelectedColor: '#1677ff',
      itemActiveBg: '#e6f4ff',
      itemBorderRadius: 8,
      itemMarginInline: 10,
      itemMarginBlock: 4,
      itemHeight: 40,
      iconSize: 16,
      collapsedIconSize: 16,
      darkItemBg: '#0b1220',
      darkSubMenuItemBg: '#0b1220',
      darkItemColor: 'rgba(255,255,255,0.72)',
      darkItemHoverColor: '#ffffff',
      darkItemSelectedBg: '#1677ff',
      darkItemSelectedColor: '#ffffff',
    },
    Card: {
      borderRadiusLG: 12,
      headerFontSize: 16,
      headerHeight: 56,
      paddingLG: 24,
    },
    Table: {
      borderColor: '#f0f0f0',
      headerBg: '#fafafa',
      headerColor: '#595959',
      rowHoverBg: '#fafafa',
      cellPaddingBlock: 14,
      cellPaddingInline: 16,
    },
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      fontWeight: 500,
    },
    Tag: {
      borderRadiusSM: 999,
      defaultBg: '#f5f5f5',
      defaultColor: '#434343',
      fontSizeSM: 12,
    },
    Typography: {
      titleMarginBottom: 0,
      titleMarginTop: 0,
    },
    Alert: {
      borderRadiusLG: 12,
    },
    Drawer: {
      colorBgElevated: '#ffffff',
    },
    Steps: {
      colorTextDescription: '#8c8c8c',
    },
    Result: {
      titleFontSize: 28,
      subtitleFontSize: 15,
      iconFontSize: 64,
    },
  },
};

export const lightTheme: ThemeConfig = {
  ...shared,
  token: {
    ...shared.token,
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f5f7fa',
  },
};

export const darkTheme: ThemeConfig = {
  ...shared,
  token: {
    ...shared.token,
    colorText: '#f8fafc',
    colorTextSecondary: '#cbd5e1',
    colorBgContainer: '#111827',
    colorBgElevated: '#111827',
    colorBgLayout: '#020617',
    colorBorderSecondary: '#1f2937',
  },
  components: {
    ...shared.components,
    Layout: {
      ...shared.components?.Layout,
      headerBg: '#111827',
      siderBg: '#0b1220',
      bodyBg: '#020617',
      triggerBg: '#0b1220',
    },
    Menu: {
      ...shared.components?.Menu,
      itemColor: '#cbd5e1',
      itemHoverColor: '#ffffff',
      itemHoverBg: '#172033',
      itemSelectedBg: '#1d4ed8',
      itemSelectedColor: '#ffffff',
      itemActiveBg: '#1e3a8a',
      darkItemBg: '#0b1220',
      darkSubMenuItemBg: '#0b1220',
      darkItemSelectedBg: '#1677ff',
    },
    Table: {
      ...shared.components?.Table,
      borderColor: '#1f2937',
      headerBg: '#0f172a',
      headerColor: '#cbd5e1',
      rowHoverBg: '#111827',
    },
    Drawer: {
      colorBgElevated: '#0b1220',
    },
  },
};
