import { Badge } from '@/components/ui/badge';
import DataTable from './DataTable';

export default {
  title: 'Data/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

const COLUMNS = [
  { key: 'name', label: 'Nome' },
  { key: 'role', label: 'Função' },
  { key: 'status', label: 'Estado', render: (v) => (
    <Badge variant={v === 'Activo' ? 'default' : v === 'Pendente' ? 'secondary' : 'outline'}>
      {v}
    </Badge>
  )},
  { key: 'date', label: 'Data de entrada' },
];

const ROWS = [
  { id: 1, name: 'Ana Costa', role: 'Designer', status: 'Activo', date: '2024-01-15' },
  { id: 2, name: 'Bruno Silva', role: 'Engenheiro', status: 'Activo', date: '2024-02-20' },
  { id: 3, name: 'Carla Neves', role: 'Gestora', status: 'Pendente', date: '2025-01-10' },
  { id: 4, name: 'David Pinto', role: 'Suporte', status: 'Inactivo', date: '2023-11-05' },
  { id: 5, name: 'Eva Martins', role: 'Engenheira', status: 'Activo', date: '2024-07-18' },
  { id: 6, name: 'Filipe Ramos', role: 'Designer', status: 'Activo', date: '2024-09-03' },
  { id: 7, name: 'Gisela Torres', role: 'Gestora', status: 'Pendente', date: '2025-03-01' },
];

export const Default = { args: { rows: ROWS, columns: COLUMNS } };

export const WithActions = {
  args: {
    rows: ROWS,
    columns: COLUMNS,
    onRowAction: () => {},
  },
};

export const WithFilters = {
  args: {
    rows: ROWS,
    columns: COLUMNS,
    onRowAction: () => {},
    filterDefs: [
      { key: 'role', label: 'Função', type: 'text' },
      { key: 'status', label: 'Estado', type: 'text' },
      { key: 'date', label: 'Data', type: 'date-range' },
    ],
  },
};

export const SmallPageSize = {
  args: { rows: ROWS, columns: COLUMNS, pageSize: 3 },
};

export const Empty = {
  args: { rows: [], columns: COLUMNS },
};
