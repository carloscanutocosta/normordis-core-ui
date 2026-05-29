import Breadcrumbs from './Breadcrumbs';

export default {
  title: 'Data/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
};

export const Default = {
  args: {
    items: [{ label: 'Início' }, { label: 'Processos' }, { label: 'Processo #1042' }],
  },
};

export const TwoLevels = {
  args: {
    items: [{ label: 'Início' }, { label: 'Relatórios' }],
  },
};

export const SingleLevel = {
  args: {
    items: [{ label: 'Início' }],
  },
};

export const Deep = {
  args: {
    items: [
      { label: 'Início' },
      { label: 'Administração' },
      { label: 'Utilizadores' },
      { label: 'Grupos' },
      { label: 'Grupo de Gestores' },
    ],
  },
};

export const InPageHeader = {
  name: 'Em cabeçalho de página',
  render: () => (
    <div className="space-y-1">
      <Breadcrumbs items={[{ label: 'Início' }, { label: 'Clientes' }, { label: 'Empresa XYZ' }]} />
      <h1 className="text-xl font-bold text-foreground">Empresa XYZ</h1>
    </div>
  ),
};
