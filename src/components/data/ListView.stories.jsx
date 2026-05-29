import ListView from './ListView';

export default {
  title: 'Data/ListView',
  component: ListView,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

const COLUMNS = [
  { key: 'name', label: 'Nome' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Função' },
];

const ITEMS = [
  { id: 1, name: 'Ana Costa', email: 'ana@empresa.pt', role: 'Designer' },
  { id: 2, name: 'Bruno Silva', email: 'bruno@empresa.pt', role: 'Engenheiro' },
  { id: 3, name: 'Carla Neves', email: 'carla@empresa.pt', role: 'Gestora' },
  { id: 4, name: 'David Pinto', email: 'david@empresa.pt', role: 'Suporte' },
  { id: 5, name: 'Eva Martins', email: 'eva@empresa.pt', role: 'Engenheira' },
];

export const Default = { args: { items: ITEMS, columns: COLUMNS } };

export const Selectable = {
  args: {
    items: ITEMS,
    columns: COLUMNS,
    selectable: true,
    onSelectionChange: () => {},
  },
};

export const WithActions = {
  args: {
    items: ITEMS,
    columns: COLUMNS,
    onRowAction: () => {},
  },
};

export const Empty = {
  args: { items: [], columns: COLUMNS },
};
