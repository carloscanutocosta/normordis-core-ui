import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { applyTheme, getStoredTheme } from '@/lib/theme';

// ─── Public interfaces ─────────────────────────────────────────────────────────

/** Lucide-compatible icon component */
export type IconComponent = ComponentType<{ className?: string }>;

/** A workspace application registered in the LeftRail. */
export interface AppDefinition {
  /** Unique identifier used in navigation and tabs. */
  id: string;
  /** Human-readable name shown in the LeftRail and TabBar. */
  label: string;
  /** Lucide icon component. */
  icon: IconComponent;
  /**
   * Grouping category:
   * - `'core'` — main navigation (default)
   * - `'system'` — below separator (e.g. Settings)
   */
  category?: 'core' | 'system' | string;
}

/** A right-rail tool that opens a slide-out panel. */
export interface ToolDefinition {
  id: string;
  label: string;
  icon: IconComponent;
}

/** A workspace notification item. */
export interface WorkspaceNotification {
  id: string;
  title: string;
  description?: string;
  /** Display string, e.g. "há 5 min" */
  time?: string;
  read?: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
}

/** A command palette entry. */
export interface WorkspaceCommand {
  id: string;
  label: string;
  /** Short hint shown on the right of the entry. */
  description?: string;
  icon?: IconComponent;
  onSelect: () => void;
}

// ─── Internal types ────────────────────────────────────────────────────────────

interface Tab {
  id: string;
  label: string;
}

export interface AtendimentoForm {
  area: string;
  assunto: string;
  descricao: string;
  resposta: string;
  canal: string;
  prioridade: string;
  estado: string;
  utilizador_contacto: string;
  duracao_minutos: string | number;
  notas_internas: string;
}

export interface AtendimentoState {
  started: boolean;
  startTime: string | null;
  step: number;
  form: AtendimentoForm | null;
}

interface WorkspaceContextValue {
  // ── State
  apps: AppDefinition[];
  rightTools: ToolDefinition[];
  activeApp: string | null;
  openTabs: Tab[];
  activeTool: string | null;
  rightPanelOpen: boolean;
  leftRailCollapsed: boolean;
  mobileRailOpen: boolean;
  theme: string;
  commandOpen: boolean;
  appBadges: Record<string, number>;
  appParams: Record<string, unknown>;
  dynamicCommandsByApp: Record<string, WorkspaceCommand[]>;
  internalNotifications: WorkspaceNotification[];
  atendimento: AtendimentoState;
  // ── Navigation
  openApp: (appId: string, params?: unknown) => void;
  closeTab: (tabId: string) => void;
  setActiveApp: React.Dispatch<React.SetStateAction<string | null>>;
  // ── Tools / panels
  toggleTool: (toolId: string) => void;
  // ── Rail
  setLeftRailCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  openMobileRail: () => void;
  closeMobileRail: () => void;
  // ── Theme
  changeTheme: (id: string) => void;
  // ── Commands
  openCommand: () => void;
  closeCommand: () => void;
  // ── Per-app
  setAppBadge: (appId: string, count: number) => void;
  registerCommands: (appId: string, commands: WorkspaceCommand[]) => () => void;
  // ── Notifications
  notify: (notification: Omit<WorkspaceNotification, 'id'>) => void;
  readInternalNotification: (id: string) => void;
  clearInternalNotification: (id?: string) => void;
  readAllInternalNotifications: () => void;
  // ── Atendimento
  updateAtendimento: (patch: Partial<AtendimentoState>) => void;
  resetAtendimento: () => void;
}

// ─── Session persistence ──────────────────────────────────────────────────────

const SESSION_KEY = 'normordis-workspace-session';

interface SessionData {
  activeApp: string | null;
  openTabs: Tab[];
  leftRailCollapsed: boolean;
  atendimento: AtendimentoState;
}

function readSession(): Partial<SessionData> {
  try {
    const raw = typeof window !== 'undefined' ? sessionStorage.getItem(SESSION_KEY) : null;
    return raw ? (JSON.parse(raw) as Partial<SessionData>) : {};
  } catch {
    return {};
  }
}

function writeSession(data: SessionData): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage may be unavailable (quota exceeded, private browsing restrictions)
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

/** Exported so ContentArea can provide it and useApp() can read it. */
export const AppIdContext = createContext<string | null>(null);

let _notifSeq = 0;
const genId = () => `ws-${Date.now()}-${++_notifSeq}`;

// ─── Provider ─────────────────────────────────────────────────────────────────

interface WorkspaceProviderProps {
  children: ReactNode;
  apps?: AppDefinition[];
  rightTools?: ToolDefinition[];
  defaultApp?: string;
}

export function WorkspaceProvider({
  children,
  apps = [],
  rightTools = [],
  defaultApp,
}: WorkspaceProviderProps) {
  const firstApp = defaultApp ?? apps[0]?.id ?? null;

  // ── Core navigation (restored from sessionStorage when available)
  const [activeApp, setActiveApp] = useState<string | null>(() => {
    const s = readSession();
    return s.activeApp && apps.some((a) => a.id === s.activeApp) ? s.activeApp : firstApp;
  });
  const [openTabs, setOpenTabs] = useState<Tab[]>(() => {
    const s = readSession();
    const restored = s.openTabs?.filter((t) => apps.some((a) => a.id === t.id));
    if (restored && restored.length > 0) return restored;
    return firstApp
      ? [{ id: firstApp, label: apps.find((a) => a.id === firstApp)?.label ?? firstApp }]
      : [];
  });

  // ── Right rail
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  // ── Left rail
  const [leftRailCollapsed, setLeftRailCollapsed] = useState<boolean>(() => {
    const s = readSession();
    return s.leftRailCollapsed ?? (typeof window !== 'undefined' && window.innerWidth < 768);
  });
  const [mobileRailOpen, setMobileRailOpen] = useState(false);

  // ── Theme
  const [theme, setThemeState] = useState(() => getStoredTheme());

  // ── Command palette
  const [commandOpen, setCommandOpen] = useState(false);

  // ── Per-app state
  const [appBadges, setAppBadges] = useState<Record<string, number>>({});
  const [appParams, setAppParams] = useState<Record<string, unknown>>({});
  const [dynamicCommandsByApp, setDynamicCommandsByApp] = useState<
    Record<string, WorkspaceCommand[]>
  >({});

  // ── Internal notifications
  const [internalNotifications, setInternalNotifications] = useState<WorkspaceNotification[]>([]);

  // ── Atendimento session (persisted so in-progress work survives a page refresh)
  const [atendimento, setAtendimento] = useState<AtendimentoState>(() => {
    const s = readSession();
    return s.atendimento ?? { started: false, startTime: null, step: 0, form: null };
  });

  // Auto-close mobile rail on resize to desktop
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => {
      if (!e.matches) setMobileRailOpen(false);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Persist navigation session on every relevant change
  useEffect(() => {
    writeSession({ activeApp, openTabs, leftRailCollapsed, atendimento });
  }, [activeApp, openTabs, leftRailCollapsed, atendimento]);

  // ── Actions

  const changeTheme = useCallback((id: string) => {
    setThemeState(id);
    applyTheme(id);
  }, []);

  const openApp = useCallback(
    (appId: string, params?: unknown) => {
      const app = apps.find((a) => a.id === appId);
      if (!app) return;
      setActiveApp(appId);
      setOpenTabs((prev) =>
        prev.find((t) => t.id === appId) ? prev : [...prev, { id: appId, label: app.label }],
      );
      if (params !== undefined) {
        setAppParams((prev) => ({ ...prev, [appId]: params }));
      }
    },
    [apps],
  );

  const closeTab = useCallback(
    (tabId: string) => {
      setOpenTabs((prev) => {
        const next = prev.filter((t) => t.id !== tabId);
        if (next.length === 0) return prev;
        if (activeApp === tabId) setActiveApp(next[next.length - 1].id);
        return next;
      });
    },
    [activeApp],
  );

  const toggleTool = useCallback(
    (toolId: string) => {
      if (activeTool === toolId) {
        setActiveTool(null);
        setRightPanelOpen(false);
      } else {
        setActiveTool(toolId);
        setRightPanelOpen(true);
      }
    },
    [activeTool],
  );

  const openCommand = useCallback(() => setCommandOpen(true), []);
  const closeCommand = useCallback(() => setCommandOpen(false), []);
  const openMobileRail = useCallback(() => setMobileRailOpen(true), []);
  const closeMobileRail = useCallback(() => setMobileRailOpen(false), []);

  const setAppBadge = useCallback((appId: string, count: number) => {
    setAppBadges((prev) => ({ ...prev, [appId]: count }));
  }, []);

  const registerCommands = useCallback((appId: string, commands: WorkspaceCommand[]) => {
    setDynamicCommandsByApp((prev) => ({ ...prev, [appId]: commands }));
    return () => {
      setDynamicCommandsByApp((prev) => {
        const next = { ...prev };
        delete next[appId];
        return next;
      });
    };
  }, []);

  const notify = useCallback((notification: Omit<WorkspaceNotification, 'id'>) => {
    setInternalNotifications((prev) => [{ ...notification, id: genId(), read: false }, ...prev]);
  }, []);

  const readInternalNotification = useCallback((id: string) => {
    setInternalNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const clearInternalNotification = useCallback((id?: string) => {
    setInternalNotifications((prev) => (id ? prev.filter((n) => n.id !== id) : []));
  }, []);

  const readAllInternalNotifications = useCallback(() => {
    setInternalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const updateAtendimento = useCallback((patch: Partial<AtendimentoState>) => {
    setAtendimento((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetAtendimento = useCallback(() => {
    setAtendimento({ started: false, startTime: null, step: 0, form: null });
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        apps,
        rightTools,
        activeApp,
        openTabs,
        activeTool,
        rightPanelOpen,
        leftRailCollapsed,
        mobileRailOpen,
        theme,
        commandOpen,
        appBadges,
        appParams,
        dynamicCommandsByApp,
        internalNotifications,
        atendimento,
        openApp,
        closeTab,
        setActiveApp,
        toggleTool,
        setLeftRailCollapsed,
        changeTheme,
        openCommand,
        closeCommand,
        openMobileRail,
        closeMobileRail,
        setAppBadge,
        registerCommands,
        notify,
        readInternalNotification,
        clearInternalNotification,
        readAllInternalNotifications,
        updateAtendimento,
        resetAtendimento,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return ctx;
}
