import { createContext, useContext, useState, useCallback } from 'react';
import { applyTheme, getStoredTheme } from '@/lib/theme';

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children, apps = [], rightTools = [], defaultApp }) {
  const firstApp = defaultApp ?? apps[0]?.id ?? null;

  const [activeApp, setActiveApp] = useState(firstApp);
  const [openTabs, setOpenTabs] = useState(
    firstApp ? [{ id: firstApp, label: apps.find(a => a.id === firstApp)?.label ?? firstApp }] : []
  );
  const [activeTool, setActiveTool] = useState(null);
  const [leftRailCollapsed, setLeftRailCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [theme, setThemeState] = useState(() => getStoredTheme());
  const [commandOpen, setCommandOpen] = useState(false);

  const changeTheme = useCallback((id) => {
    setThemeState(id);
    applyTheme(id);
  }, []);

  const openApp = useCallback((appId) => {
    const app = apps.find(a => a.id === appId);
    if (!app) return;
    setActiveApp(appId);
    setOpenTabs(prev => {
      if (prev.find(t => t.id === appId)) return prev;
      return [...prev, { id: appId, label: app.label }];
    });
  }, [apps]);

  const closeTab = useCallback((tabId) => {
    setOpenTabs(prev => {
      const next = prev.filter(t => t.id !== tabId);
      if (next.length === 0) return prev;
      if (activeApp === tabId) setActiveApp(next[next.length - 1].id);
      return next;
    });
  }, [activeApp]);

  const toggleTool = useCallback((toolId) => {
    if (activeTool === toolId) {
      setActiveTool(null);
      setRightPanelOpen(false);
    } else {
      setActiveTool(toolId);
      setRightPanelOpen(true);
    }
  }, [activeTool]);

  const openCommand = useCallback(() => setCommandOpen(true), []);
  const closeCommand = useCallback(() => setCommandOpen(false), []);

  return (
    <WorkspaceContext.Provider value={{
      apps,
      rightTools,
      activeApp,
      openTabs,
      activeTool,
      leftRailCollapsed,
      rightPanelOpen,
      theme,
      commandOpen,
      openApp,
      closeTab,
      setActiveApp,
      toggleTool,
      setLeftRailCollapsed,
      changeTheme,
      openCommand,
      closeCommand,
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return ctx;
}
