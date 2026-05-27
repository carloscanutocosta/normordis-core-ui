import { WorkspaceProvider } from './WorkspaceContext';
import Header from './Header';
import LeftRail from './LeftRail';
import RightRail from './RightRail';
import RightPanel from './RightPanel';
import ContentArea from './ContentArea';
import StatusBar from './StatusBar';
import WorkspaceCommandPalette from './WorkspaceCommandPalette';

/**
 * AppShell — institutional layout shell for Normordis applications.
 *
 * @param {Array}    apps
 * @param {Array}    rightTools
 * @param {string}   defaultApp
 * @param {Object}   panels              - { [toolId]: { title, icon, content: ReactNode } }
 * @param {ReactNode} logo
 * @param {string}   appName
 * @param {{ name?, email? }} user
 * @param {() => void} onLogout
 * @param {ReactNode} headerActions
 * @param {Array}    notifications       - [{ id, title, description?, time?, read?, type? }]
 * @param {Function} onNotificationRead  - (id) => void
 * @param {Function} onNotificationsReadAll
 * @param {Function} onNotificationClear - (id?) => void
 * @param {Array}    commands            - extra command palette items [{ id, label, description?, icon?, onSelect }]
 * @param {boolean}  showAtendimento
 * @param {Function} onAtendimentoSave   - async (data) => void
 * @param {string[]} atendimentoAreas
 * @param {Array}    atendimentoCanais
 * @param {Array}    atendimentoPrioridades
 * @param {string[]} atendimentoEstados
 * @param {string}   locale
 * @param {Function|ReactNode} children
 */
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
}) {
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
            <>
              <RightPanel panels={panels} />
              <RightRail />
            </>
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
