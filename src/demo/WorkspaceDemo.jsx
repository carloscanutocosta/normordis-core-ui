import { useState } from 'react';
import {
  LayoutDashboard, FileText, BarChart3, Users,
  CheckSquare, Settings, Star, Calendar, Bell,
} from 'lucide-react';
import { AppShell } from '@/components/workspace/AppShell';

/* ── Mock apps ───────────────────────────────────────────── */
const APPS = [
  { id: 'dashboard', label: 'Dashboard',   icon: LayoutDashboard, category: 'core' },
  { id: 'documents', label: 'Documentos',  icon: FileText,        category: 'core' },
  { id: 'analytics', label: 'Analíticas',  icon: BarChart3,       category: 'core' },
  { id: 'team',      label: 'Equipa',      icon: Users,           category: 'core' },
  { id: 'tasks',     label: 'Tarefas',     icon: CheckSquare,     category: 'core' },
  { id: 'settings',  label: 'Definições',  icon: Settings,        category: 'system' },
];

const RIGHT_TOOLS = [
  { id: 'favorites', label: 'Favoritos',  icon: Star     },
  { id: 'calendar',  label: 'Calendário', icon: Calendar },
];

const PANELS = {
  favorites: {
    title: 'Favoritos',
    icon: Star,
    content: (
      <div className="p-4 space-y-2">
        {['Dashboard Principal', 'Relatório Q1', 'Equipa Dev'].map(item => (
          <div key={item} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer text-xs">
            <Star className="w-3.5 h-3.5 text-amber-500" />
            {item}
          </div>
        ))}
      </div>
    ),
  },
  calendar: {
    title: 'Calendário',
    icon: Calendar,
    content: (
      <div className="p-4 space-y-1">
        <p className="text-xs font-medium mb-3">Hoje</p>
        {[
          { time: '09:00', label: 'Standup' },
          { time: '11:00', label: 'Revisão de Sprint' },
          { time: '14:30', label: 'Reunião cliente' },
        ].map(ev => (
          <div key={ev.time} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
            <span className="text-[11px] font-mono text-muted-foreground w-10 shrink-0">{ev.time}</span>
            <span className="text-xs">{ev.label}</span>
          </div>
        ))}
      </div>
    ),
  },
};

/* ── Mock app components ─────────────────────────────────── */
function MockApp({ title, color }) {
  return (
    <div className="p-8">
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 ${color}`}>
        Demo
      </div>
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground text-sm">
        Esta é uma app de demonstração integrada na shell do workspace.
        Substitui este componente pelo conteúdo real da tua app.
      </p>
    </div>
  );
}

const APP_COMPONENTS = {
  dashboard: <MockApp title="Dashboard" color="bg-blue-100 text-blue-700" />,
  documents: <MockApp title="Documentos" color="bg-purple-100 text-purple-700" />,
  analytics: <MockApp title="Analíticas" color="bg-teal-100 text-teal-700" />,
  team:      <MockApp title="Equipa" color="bg-orange-100 text-orange-700" />,
  tasks:     <MockApp title="Tarefas" color="bg-green-100 text-green-700" />,
  settings:  <MockApp title="Definições" color="bg-slate-100 text-slate-700" />,
};

/* ── Demo ────────────────────────────────────────────────── */
export default function WorkspaceDemo() {
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Novo documento partilhado',  description: 'João Silva partilhou "Relatório Q1"', time: 'há 2 min',  read: false, type: 'info' },
    { id: '2', title: 'Tarefa concluída',            description: 'Revisão de código aprovada',         time: 'há 15 min', read: false, type: 'success' },
    { id: '3', title: 'Reunião em 10 minutos',       description: 'Standup diário às 09:00',            time: 'há 1 h',    read: true,  type: 'warning' },
    { id: '4', title: 'Falha no relatório',          description: 'Exportação PDF falhou — tenta novamente', time: 'há 2 h', read: true, type: 'error' },
  ]);

  const handleNotificationRead = (id) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const handleNotificationsReadAll = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const handleNotificationClear = (id) =>
    setNotifications(prev => id ? prev.filter(n => n.id !== id) : []);

  const handleAtendimentoSave = async (data) => {
    await new Promise(r => setTimeout(r, 800));
    console.log('[WorkspaceDemo] Atendimento registado:', data);
  };

  return (
    <AppShell
      apps={APPS}
      rightTools={RIGHT_TOOLS}
      panels={PANELS}
      appName="Normordis Demo"
      user={{ name: 'Carlos Costa', email: 'carlos@normordis.pt' }}
      onLogout={() => alert('Logout')}
      notifications={notifications}
      onNotificationRead={handleNotificationRead}
      onNotificationsReadAll={handleNotificationsReadAll}
      onNotificationClear={handleNotificationClear}
      showAtendimento
      onAtendimentoSave={handleAtendimentoSave}
    >
      {(activeApp) => APP_COMPONENTS[activeApp] ?? null}
    </AppShell>
  );
}
