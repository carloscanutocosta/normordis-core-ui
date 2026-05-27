import { WorkspaceProvider } from './WorkspaceContext';
import Header from './Header';
import LeftRail from './LeftRail';
import RightRail from './RightRail';
import RightPanel from './RightPanel';
import ContentArea from './ContentArea';
import StatusBar from './StatusBar';

/**
 * AppShell — institutional layout shell for Normordis applications.
 *
 * Usage:
 * ```jsx
 * <AppShell
 *   apps={[{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'core' }]}
 *   rightTools={[{ id: 'calendar', label: 'Calendário', icon: Calendar }]}
 *   panels={{ calendar: { title: 'Calendário', icon: Calendar, content: <MyCalendar /> } }}
 *   appName="Normordis"
 *   user={{ name: 'João Silva', email: 'joao@example.com' }}
 *   onLogout={handleLogout}
 *   onAtendimentoSave={async (data) => await api.saveAtendimento(data)}
 * >
 *   {(activeApp) => <AppRouter activeApp={activeApp} />}
 * </AppShell>
 * ```
 *
 * @param {Array}    apps               - Navigation apps for LeftRail
 * @param {Array}    rightTools         - Tool icons for RightRail
 * @param {string}   defaultApp         - Initially active app id
 * @param {Object}   panels             - { [toolId]: { title, icon, content: ReactNode } }
 * @param {ReactNode} logo              - Custom logo element
 * @param {string}   appName            - Application name shown in header
 * @param {{ name?, email? }} user      - Current user info
 * @param {() => void} onLogout         - Logout handler
 * @param {() => void} onSearch         - Search handler (omit to hide search bar)
 * @param {ReactNode} headerActions     - Extra elements in the header action area
 * @param {boolean}  showAtendimento    - Show/hide "Registar Atendimento" in status bar
 * @param {(data) => Promise<void>} onAtendimentoSave
 * @param {string}   locale             - Date/time locale (default 'pt-PT')
 * @param {Function|ReactNode} children - (activeApp: string) => ReactNode, or plain ReactNode
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
  onSearch,
  headerActions,
  showAtendimento = true,
  onAtendimentoSave,
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
          onSearch={onSearch}
          actions={headerActions}
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
        />
      </div>
    </WorkspaceProvider>
  );
}
