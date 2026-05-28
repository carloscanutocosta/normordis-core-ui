import { Badge } from './badge';

export default {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
    children: { control: 'text' },
  },
};

export const Default     = { args: { children: 'Activo' } };
export const Secondary   = { args: { children: 'Pendente',   variant: 'secondary'   } };
export const Destructive = { args: { children: 'Erro',       variant: 'destructive' } };
export const Outline     = { args: { children: 'Rascunho',   variant: 'outline'     } };

export const AllVariants = {
  name: 'All variants',
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const InContext = {
  name: 'In context',
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm">Estado do processo</span>
        <Badge>Activo</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Prioridade</span>
        <Badge variant="destructive">Urgente</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Fase</span>
        <Badge variant="outline">Rascunho</Badge>
      </div>
    </div>
  ),
};
