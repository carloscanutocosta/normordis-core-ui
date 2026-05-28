import { useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WorkspaceProvider, useWorkspace } from './WorkspaceContext';
import NotificationsPanel from './NotificationsPanel';

const APPS = [
  { id: 'dashboard', label: 'Dashboard', icon: null, category: 'core' },
  { id: 'reports', label: 'Relatórios', icon: null, category: 'core' },
];

// Pre-populates internal notifications via context so the panel isn't empty
function InternalNotifSeeder({ items }) {
  const { notify } = useWorkspace();
  useEffect(() => {
    items.forEach((item) => notify(item));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

const withWorkspace = (Story) => (
  <WorkspaceProvider apps={APPS}>
    <TooltipProvider>
      <Story />
    </TooltipProvider>
  </WorkspaceProvider>
);

export default {
  title: 'Workspace/NotificationsPanel',
  component: NotificationsPanel,
  decorators: [withWorkspace],
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export const Empty = {
  args: { notifications: [] },
};

export const WithExternalUnread = {
  name: 'External — unread',
  args: {
    notifications: [
      {
        id: 'e1',
        title: 'Registo guardado',
        type: 'success',
        read: false,
        description: 'O processo 2024/001 foi guardado com sucesso.',
        time: 'Há 2 min',
      },
      {
        id: 'e2',
        title: 'Prazo a expirar',
        type: 'warning',
        read: false,
        description: 'O processo 2023/999 expira amanhã.',
        time: 'Há 15 min',
      },
    ],
    onNotificationRead: (id) => console.log('read', id),
    onNotificationsReadAll: () => console.log('read all'),
    onNotificationClear: (id) => console.log('clear', id),
  },
};

export const Mixed = {
  name: 'Mixed read/unread',
  args: {
    notifications: [
      { id: 'e1', title: 'Exportação concluída', type: 'success', read: true, time: 'Há 1h' },
      {
        id: 'e2',
        title: 'Erro de sincronização',
        type: 'error',
        read: false,
        description: 'Falha ao sincronizar dados com o servidor.',
        time: 'Há 5 min',
      },
      { id: 'e3', title: 'Actualização disponível', type: 'info', read: false, time: 'Há 30 min' },
    ],
  },
};

export const WithInternalNotifications = {
  name: 'Internal (from useApp)',
  decorators: [
    (Story) => (
      <WorkspaceProvider apps={APPS}>
        <TooltipProvider>
          <InternalNotifSeeder
            items={[
              {
                title: 'Processo arquivado',
                type: 'success',
                description: 'O processo foi arquivado com sucesso.',
              },
              {
                title: 'Permissão negada',
                type: 'error',
                description: 'Não tem permissão para esta acção.',
              },
              { title: 'Sincronização activa', type: 'info' },
            ]}
          />
          <Story />
        </TooltipProvider>
      </WorkspaceProvider>
    ),
  ],
  args: {},
};
