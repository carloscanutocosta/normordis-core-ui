import type { ReactNode } from 'react';
import { WorkspaceProvider } from './WorkspaceContext';
import type { AppDefinition, ToolDefinition, WorkspaceNotification, WorkspaceCommand } from './WorkspaceContext';
import Header from './Header';
import LeftRail from './LeftRail';
import RightRail from './RightRail';
import RightPanel from './RightPanel';
import ContentArea from './ContentArea';
import StatusBar from './StatusBar';
import WorkspaceCommandPalette from './WorkspaceCommandPalette';
import type { AtendimentoData } from './AtendimentoPanel';

// ─── Public interfaces ─────────────────────────────────────────────────────────

/** A right-panel configuration. Keys must match a `ToolDefinition.id`. */
export interface PanelDefinition {
  title: string;
  icon?: ToolDefinition['icon'];
  content: ReactNode;
}

/** Full props for `<AppShell>`. */
export interface AppShellProps {
  /** Application definitions for the LeftRail. */
  apps: AppDefinition[];
  /** Tool definitions for the RightRail (optional). */
  rightTools?: ToolDefinition[];
  /** ID of the app to open by default (defaults to `apps[0].id`). */
  defaultApp?: string;
  /** Panel content keyed by `ToolDefinition.id`. Required when `rightTools` is non-empty. */
  panels?: Record<string, PanelDefinition>;
  /** Custom logo element (defaults to "W" placeholder). */
  logo?: ReactNode;
  /** Application name shown in the Header. */
  appName?: string;
  /** Authenticated user — shown in StatusBar and user menu. */
  user?: { name?: string; email?: string };
  /** Called when the user clicks "Terminar Sessão". */
  onLogout?: () => void;
  /** Extra React nodes rendered in the Header's right section. */
  headerActions?: ReactNode;
  // — External notifications
  notifications?: WorkspaceNotification[];
  onNotificationRead?: (id: string) => void;
  onNotificationsReadAll?: () => void;
  /** Omit `id` to clear all. */
  onNotificationClear?: (id?: string) => void;
  // — Static command palette entries
  commands?: WorkspaceCommand[];
  // — Atendimento panel
  /** Show the "Registar Atendimento" button in StatusBar (default: true). */
  showAtendimento?: boolean;
  onAtendimentoSave?: (data: AtendimentoData) => Promise<void>;
  atendimentoAreas?: string[];
  atendimentoCanais?: Array<{ label: string; icon: AppDefinition['icon'] }>;
  atendimentoPrioridades?: Array<{ label: string; color: string }>;
  atendimentoEstados?: string[];
  /** Date/time locale (default: 'pt-PT'). */
  locale?: string;
  /**
   * Render function — receives the active app id and returns its component.
   * All mounted tabs call this function simultaneously; use the `appId`
   * argument to return the correct component for each app.
   *
   * @example
   * {(appId) => APP_COMPONENTS[appId] ?? null}
   */
  children: (appId: string) => ReactNode;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function AppShell({
  apps = [],
  rightTools = [],
  defaultApp,
  panels = {},
  logo,
  appName,
  user,
  onLogout,
  headerActions,
  notifications,
  onNotificationRead,
  onNotificationsReadAll,
  onNotificationClear,
  commands = [],
  showAtendimento = true,
  onAtendimentoSave,
  atendimentoAreas,
  atendimentoCanais,
  atendimentoPrioridades,
  atendimentoEstados,
  locale = 'pt-PT',
  children,
}: AppShellProps) {
  return (
    <WorkspaceProvider apps={apps} rightTools={rightTools} defaultApp={defaultApp}>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        <Header
          logo={logo}
          appName={appName}
          user={user}
          onLogout={onLogout}
          actions={headerActions}
          notifications={notifications}
          onNotificationRead={onNotificationRead}
          onNotificationsReadAll={onNotificationsReadAll}
          onNotificationClear={onNotificationClear}
        />

        <div className="flex-1 flex overflow-hidden">
          <LeftRail />

          <ContentArea>
            {children}
          </ContentArea>

          {rightTools.length > 0 && (
            <div className="hidden md:flex items-stretch">
              <RightPanel panels={panels} />
              <RightRail />
            </div>
          )}
        </div>

        <StatusBar
          user={user}
          locale={locale}
          showAtendimento={showAtendimento}
          onAtendimentoSave={onAtendimentoSave}
          areas={atendimentoAreas}
          canais={atendimentoCanais}
          prioridades={atendimentoPrioridades}
          estados={atendimentoEstados}
        />

        <WorkspaceCommandPalette commands={commands} />
      </div>
    </WorkspaceProvider>
  );
}
