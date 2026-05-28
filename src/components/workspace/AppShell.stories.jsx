import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  BarChart2,
  Filter,
  SlidersHorizontal,
  Plus,
  Download,
} from 'lucide-react';
import AppShell from './AppShell';

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const APPS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'core' },
  { id: 'documents', label: 'Documentos', icon: FileText, category: 'core' },
  { id: 'reports', label: 'Relatórios', icon: BarChart2, category: 'core' },
  { id: 'users', label: 'Utilizadores', icon: Users, category: 'core' },
  { id: 'settings', label: 'Definições', icon: Settings, category: 'system' },
];

const RIGHT_TOOLS = [
  { id: 'filters', label: 'Filtros', icon: Filter },
  { id: 'properties', label: 'Propriedades', icon: SlidersHorizontal },
];

const PANELS = {
  filters: {
    title: 'Filtros',
    icon: Filter,
    content: (
      <div className="p-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Estado
        </p>
        {['Aberto', 'Em progresso', 'Resolvido', 'Fechado'].map((s) => (
          <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="rounded" /> {s}
          </label>
        ))}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">
          Prioridade
        </p>
        {['Baixa', 'Normal', 'Alta', 'Urgente'].map((p) => (
          <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="rounded" /> {p}
          </label>
        ))}
      </div>
    ),
  },
  properties: {
    title: 'Propriedades',
    icon: SlidersHorizontal,
    content: (
      <div className="p-4 space-y-3 text-sm text-muted-foreground">
        <p>Nenhum item seleccionado.</p>
      </div>
    ),
  },
};

const COMMANDS = [
  {
    id: 'new',
    label: 'Novo processo',
    icon: Plus,
    description: 'Abre formulário',
    onSelect: () => console.log('new'),
  },
  {
    id: 'export',
    label: 'Exportar dados',
    icon: Download,
    description: 'Exporta a vista actual',
    onSelect: () => console.log('export'),
  },
];

const EXTERNAL_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Aprovação pendente',
    type: 'warning',
    read: false,
    description: 'O processo 2024/042 aguarda aprovação.',
    time: 'Há 5 min',
  },
  { id: 'n2', title: 'Exportação concluída', type: 'success', read: false, time: 'Há 12 min' },
  {
    id: 'n3',
    title: 'Sistema actualizado',
    type: 'info',
    read: true,
    description: 'v2.3.1 instalada com sucesso.',
    time: 'Há 2h',
  },
];

const USER = { name: 'Ana Ferreira', email: 'ana.ferreira@example.com' };

// ─── App content mock ─────────────────────────────────────────────────────────

function AppPlaceholder({ appId }) {
  const labels = {
    dashboard: 'Dashboard',
    documents: 'Documentos',
    reports: 'Relatórios',
    users: 'Utilizadores',
    settings: 'Definições',
  };
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground select-none">
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
        <LayoutDashboard className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium">{labels[appId] ?? appId}</p>
      <p className="text-xs opacity-60">Conteúdo da app</p>
    </div>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export default {
  title: 'Workspace/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Shell completo do workspace: Header, LeftRail, ContentArea (com tabs e error boundaries), RightRail, RightPanel, StatusBar e CommandPalette. Orquestra todos os componentes do workspace e gere a sessão no WorkspaceProvider.',
      },
    },
  },
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Minimal = {
  name: 'Mínimo',
  parameters: {
    docs: {
      description: {
        story: 'Configuração mínima: só as apps, sem utilizador, sem atendimento, sem ferramentas.',
      },
    },
  },
  render: () => (
    <AppShell apps={APPS} showAtendimento={false}>
      {(appId) => <AppPlaceholder appId={appId} />}
    </AppShell>
  ),
};

export const WithUser = {
  name: 'Com utilizador autenticado',
  parameters: {
    docs: {
      description: {
        story:
          'Header com nome de utilizador, menu de logout e notificações externas. StatusBar mostra o utilizador em sessão.',
      },
    },
  },
  render: () => (
    <AppShell
      apps={APPS}
      appName="Normordis"
      user={USER}
      onLogout={() => console.log('logout')}
      notifications={EXTERNAL_NOTIFICATIONS}
      onNotificationRead={(id) => console.log('read', id)}
      onNotificationsReadAll={() => console.log('read all')}
      onNotificationClear={(id) => console.log('clear', id)}
      showAtendimento={false}
    >
      {(appId) => <AppPlaceholder appId={appId} />}
    </AppShell>
  ),
};

export const WithRightTools = {
  name: 'Com ferramentas (RightRail + RightPanel)',
  parameters: {
    docs: {
      description: {
        story:
          'RightRail com "Filtros" e "Propriedades". Clica nos ícones da direita para abrir o painel deslizante.',
      },
    },
  },
  render: () => (
    <AppShell
      apps={APPS}
      appName="Normordis"
      user={USER}
      onLogout={() => console.log('logout')}
      rightTools={RIGHT_TOOLS}
      panels={PANELS}
      showAtendimento={false}
    >
      {(appId) => <AppPlaceholder appId={appId} />}
    </AppShell>
  ),
};

export const WithCommandPalette = {
  name: 'Com command palette (Ctrl+K)',
  parameters: {
    docs: {
      description: {
        story:
          'Usa Ctrl+K (ou ⌘K) para abrir a paleta de comandos. Inclui apps de navegação e comandos estáticos do consumidor.',
      },
    },
  },
  render: () => (
    <AppShell
      apps={APPS}
      appName="Normordis"
      user={USER}
      onLogout={() => console.log('logout')}
      commands={COMMANDS}
      showAtendimento={false}
    >
      {(appId) => <AppPlaceholder appId={appId} />}
    </AppShell>
  ),
};

export const Full = {
  name: 'Configuração completa',
  parameters: {
    docs: {
      description: {
        story:
          'Todas as funcionalidades activas: utilizador, notificações, RightRail com painéis, command palette (Ctrl+K) e botão de atendimento na StatusBar.',
      },
    },
  },
  render: () => (
    <AppShell
      apps={APPS}
      appName="Normordis"
      user={USER}
      onLogout={() => console.log('logout')}
      notifications={EXTERNAL_NOTIFICATIONS}
      onNotificationRead={(id) => console.log('read', id)}
      onNotificationsReadAll={() => console.log('read all')}
      onNotificationClear={(id) => console.log('clear', id)}
      rightTools={RIGHT_TOOLS}
      panels={PANELS}
      commands={COMMANDS}
      showAtendimento={true}
      onAtendimentoSave={async (data) => {
        console.log('[AppShell] atendimento guardado →', data);
        await new Promise((r) => setTimeout(r, 1000));
      }}
    >
      {(appId) => <AppPlaceholder appId={appId} />}
    </AppShell>
  ),
};

export const NoAtendimento = {
  name: 'Sem atendimento (SAAS genérico)',
  parameters: {
    docs: {
      description: {
        story:
          'Com `showAtendimento={false}`, a StatusBar não mostra o botão de registo. Adequado para produtos não-municipais.',
      },
    },
  },
  render: () => (
    <AppShell
      apps={APPS.filter((a) => a.id !== 'settings')}
      appName="Plataforma SaaS"
      user={{ name: 'Carlos Costa' }}
      showAtendimento={false}
      rightTools={RIGHT_TOOLS}
      panels={PANELS}
      commands={COMMANDS}
    >
      {(appId) => <AppPlaceholder appId={appId} />}
    </AppShell>
  ),
};
