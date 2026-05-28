import { useContext, useCallback } from 'react';
import { useWorkspace, AppIdContext } from '@/components/workspace/WorkspaceContext';
import type { WorkspaceNotification, WorkspaceCommand } from '@/components/workspace/WorkspaceContext';

// ─── Public interface ──────────────────────────────────────────────────────────

/**
 * API returned by `useApp()`.
 * Available inside any app component rendered by AppShell.
 */
export interface AppAPI {
  /** This app's unique identifier. */
  appId: string;
  /**
   * Params passed by another app via `navigate(appId, params)`.
   * Type-narrow at the point of use.
   */
  params: unknown;
  /**
   * Navigate to another app, optionally passing params.
   * The target app reads them via `useApp().params`.
   *
   * @example
   * navigate('documents', { highlight: 'relatorio-q1.pdf' });
   */
  navigate: (appId: string, params?: unknown) => void;
  /**
   * Show a notification in the workspace notification centre.
   *
   * @example
   * notify({ title: 'Exportado', type: 'success', description: 'PDF gerado com sucesso.' });
   */
  notify: (notification: Omit<WorkspaceNotification, 'id'>) => void;
  /**
   * Set the badge count on this app's LeftRail icon.
   * Pass `0` to hide the badge.
   */
  setBadge: (count: number) => void;
  /**
   * Register commands in the workspace command palette (Ctrl+K)
   * while this app is mounted. Returns a cleanup function — use
   * inside `useEffect` so commands are removed when the app unmounts.
   *
   * @example
   * useEffect(() => registerCommands([
   *   { id: 'new-task', label: 'Nova Tarefa', onSelect: () => setOpen(true) },
   * ]), []);
   */
  registerCommands: (commands: WorkspaceCommand[]) => () => void;
  /** Open the command palette programmatically. */
  openCommand: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Hook for app components rendered inside AppShell.
 * Provides navigation, notifications, badges, and command registration.
 *
 * Must be called inside a component returned by the AppShell `children`
 * render function — throws if called outside the workspace context.
 *
 * @example
 * import { useApp } from 'normordis-core-ui';
 *
 * export default function MyApp() {
 *   const { navigate, notify, setBadge, registerCommands } = useApp();
 *
 *   useEffect(() => registerCommands([
 *     { id: 'new', label: 'Novo Registo', onSelect: () => setOpen(true) },
 *   ]), []);
 *
 *   return <button onClick={() => navigate('dashboard')}>Ir para Dashboard</button>;
 * }
 */
export function useApp(): AppAPI {
  const appId = useContext(AppIdContext);
  const {
    openApp,
    notify: ctxNotify,
    setAppBadge,
    registerCommands: ctxRegisterCommands,
    openCommand,
    appParams,
  } = useWorkspace();

  if (!appId) {
    throw new Error(
      'useApp() must be called inside a component rendered by AppShell. ' +
      'Make sure the component is returned from the AppShell children function.',
    );
  }

  const navigate = useCallback(
    (targetAppId: string, params?: unknown) => openApp(targetAppId, params),
    [openApp],
  );

  const notify = useCallback(
    (notification: Omit<WorkspaceNotification, 'id'>) => ctxNotify(notification),
    [ctxNotify],
  );

  const setBadge = useCallback(
    (count: number) => setAppBadge(appId, count),
    [appId, setAppBadge],
  );

  const registerCommands = useCallback(
    (commands: WorkspaceCommand[]) => ctxRegisterCommands(appId, commands),
    [appId, ctxRegisterCommands],
  );

  return {
    appId,
    params: appParams[appId],
    navigate,
    notify,
    setBadge,
    registerCommands,
    openCommand,
  };
}
