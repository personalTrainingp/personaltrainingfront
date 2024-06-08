import { createContext, useCallback, useContext, useState } from 'react';
import i18n, { isValidLanguage, Languages } from '@/common/languages/i18n';

const ThemeContext = createContext({});

export const ThemeSettings = {
  layout: {
    type: { vertical: 'vertical', horizontal: 'horizontal' },
    mode: { fluid: 'fluid', boxed: 'boxed', detached: 'detached' },
    menuPosition: { scrollable: 'scrollable', fixed: 'fixed' },
  },
  theme: { light: 'light', dark: 'dark' },
  topbar: {
    theme: { light: 'light', dark: 'dark', brand: 'brand' },
    logo: { hidden: 'fullscreen', show: '' },
  },
  sidebar: {
    theme: { light: 'light', dark: 'dark', brand: 'brand' },
    size: {
      default: 'default',
      compact: 'compact',
      condensed: 'condensed',
      showOnHover: 'sm-hover',
      full: 'full',
      fullscreen: 'fullscreen',
    },
    user: { show: true, hidden: false },
  },
  rightSidebar: { show: true, hidden: false },
};

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within an ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(Languages.EN);

  const [settings, setSettings] = useState({
    layout: {
      type: ThemeSettings.layout.type.vertical,
      mode: ThemeSettings.layout.mode.fluid,
      menuPosition: ThemeSettings.layout.menuPosition.fixed,
    },
    theme: ThemeSettings.theme.light,
    topbar: {
      theme: ThemeSettings.topbar.theme.light,
      logo: ThemeSettings.topbar.logo.show,
    },
    sidebar: {
      theme: ThemeSettings.sidebar.theme.light,
      size: ThemeSettings.sidebar.size.default,
      user: ThemeSettings.sidebar.user.hidden,
    },
    rightSidebar: ThemeSettings.rightSidebar.hidden,
  });

  const changeLanguage = useCallback((lang) => {
    if (isValidLanguage(lang)) {
      i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
    }
  }, []);

  const updateSettings = useCallback(
    (newSettings) => {
      setSettings((prev) => ({ ...(prev ?? {}), ...(newSettings ?? {}) }));
    },
    [setSettings]
  );

  const updateLayout = useCallback(
    (newLayout) => {
      setSettings((prev) => ({
        ...(prev ?? {}),
        layout: { ...(prev ?? {}).layout, ...(newLayout ?? {}) },
      }));
    },
    [setSettings]
  );

  const updateTopbar = useCallback(
    (newTopbar) => {
      setSettings((prev) => ({
        ...(prev ?? {}),
        topbar: { ...(prev ?? {}).topbar, ...(newTopbar ?? {}) },
      }));
    },
    [setSettings]
  );

  const updateSidebar = useCallback(
    (newSidebar) => {
      setSettings((prev) => ({
        ...(prev ?? {}),
        sidebar: { ...(prev ?? {}).sidebar, ...(newSidebar ?? {}) },
      }));
    },
    [setSettings]
  );

  return (
    <ThemeContext.Provider
      value={{
        changeLanguage,
        currentLanguage,
        settings,
        updateSettings,
        updateLayout,
        updateTopbar,
        updateSidebar,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
