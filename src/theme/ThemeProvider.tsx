import type { ReactNode } from 'react';
import { ConfigProvider, App as AntApp, theme } from 'antd';
import { useUiStore } from '@/stores/uiStore';
import { lightTheme, darkTheme } from '@/theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeMode = useUiStore((s) => s.themeMode);
  const algorithm = themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm;
  const config = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ConfigProvider theme={{ ...config, algorithm }}>
      <AntApp>{children}</AntApp>
    </ConfigProvider>
  );
}