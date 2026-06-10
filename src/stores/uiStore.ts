import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface UiStore {
  sidebarCollapsed: boolean;
  themeMode: ThemeMode;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

function getStoredThemeMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = window.localStorage.getItem('theme_mode');
  return stored === 'dark' ? 'dark' : 'light';
}

function getStoredSidebarCollapsed(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem('sidebar_collapsed') === 'true';
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarCollapsed: getStoredSidebarCollapsed(),
  themeMode: getStoredThemeMode(),
  toggleSidebar: () =>
    set((s) => {
      const sidebarCollapsed = !s.sidebarCollapsed;
      window.localStorage.setItem('sidebar_collapsed', String(sidebarCollapsed));
      return { sidebarCollapsed };
    }),
  setSidebarCollapsed: (collapsed) => {
    window.localStorage.setItem('sidebar_collapsed', String(collapsed));
    set({ sidebarCollapsed: collapsed });
  },
  setThemeMode: (mode) => {
    window.localStorage.setItem('theme_mode', mode);
    set({ themeMode: mode });
  },
}));
