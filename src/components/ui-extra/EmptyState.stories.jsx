import EmptyState from './EmptyState';

export default {
  title: 'UI Extra/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    preset: {
      control: 'select',
      options: ['empty', 'search', 'error', 'noFiles', 'noUsers'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    title: { control: 'text' },
    description: { control: 'text' },
    actionLabel: { control: 'text' },
  },
};

export const Empty = { args: { preset: 'empty' } };
export const Search = { args: { preset: 'search' } };
export const Error = {
  args: { preset: 'error', actionLabel: 'Tentar novamente', onAction: () => {} },
};
export const NoFiles = {
  args: { preset: 'noFiles', actionLabel: 'Carregar ficheiro', onAction: () => {} },
};
export const NoUsers = {
  args: { preset: 'noUsers', actionLabel: 'Convidar utilizador', onAction: () => {} },
};
export const Small = { args: { preset: 'empty', size: 'sm' } };
export const Large = { args: { preset: 'empty', size: 'lg' } };
export const Custom = {
  args: {
    title: 'Sem tarefas atribuídas',
    description: 'As tarefas atribuídas a si aparecerão aqui.',
    actionLabel: 'Ver todas as tarefas',
    onAction: () => {},
  },
};

export const AllPresets = {
  name: 'Todos os presets',
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="border border-border rounded-lg">
        <EmptyState preset="empty" size="sm" />
      </div>
      <div className="border border-border rounded-lg">
        <EmptyState preset="search" size="sm" />
      </div>
      <div className="border border-border rounded-lg">
        <EmptyState preset="error" size="sm" />
      </div>
      <div className="border border-border rounded-lg">
        <EmptyState preset="noFiles" size="sm" />
      </div>
    </div>
  ),
};
