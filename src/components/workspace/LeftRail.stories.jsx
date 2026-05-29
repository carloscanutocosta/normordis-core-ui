import { useEffect } from 'react';
import { LayoutDashboard, FileText, Users, Settings, Bell } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WorkspaceProvider, useWorkspace } from './WorkspaceContext';
import LeftRail from './LeftRail';

const APPS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'core' },
  { id: 'documents', label: 'Documentos', icon: FileText, category: 'core' },
  { id: 'users', label: 'Utilizadores', icon: Users, category: 'core' },
  { id: 'notifs', label: 'Notificações', icon: Bell, category: 'core' },
  { id: 'settings', label: 'Definições', icon: Settings, category: 'system' },
];

// Sets badges inside a WorkspaceProvider via context
function BadgeInitializer({ badges }) {
  const { setAppBadge } = useWorkspace();
  useEffect(() => {
    Object.entries(badges).forEach(([appId, count]) => setAppBadge(appId, count));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

// Shared shell chrome so the rail looks realistic
function RailShell({ children, badges = {} }) {
  return (
    <WorkspaceProvider apps={APPS}>
      <BadgeInitializer badges={badges} />
      <TooltipProvider>
        <div className="h-[520px] flex border border-border rounded-lg overflow-hidden shadow-sm">
          {children}
          <div className="flex-1 bg-muted/20 flex items-center justify-center text-muted-foreground text-sm select-none">
            Área de conteúdo
          </div>
        </div>
      </TooltipProvider>
    </WorkspaceProvider>
  );
}

export default {
  title: 'Workspace/LeftRail',
  component: LeftRail,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export const Expanded = {
  name: 'Expanded',
  render: () => (
    <RailShell>
      <LeftRail />
    </RailShell>
  ),
};

export const WithBadges = {
  name: 'With badges',
  render: () => (
    <RailShell badges={{ documents: 3, notifs: 12 }}>
      <LeftRail />
    </RailShell>
  ),
};

export const HighBadgeCount = {
  name: 'High badge count (99+)',
  render: () => (
    <RailShell badges={{ documents: 150, notifs: 999 }}>
      <LeftRail />
    </RailShell>
  ),
};
