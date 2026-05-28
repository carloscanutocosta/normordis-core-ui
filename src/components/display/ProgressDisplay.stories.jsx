import ProgressDisplay from './ProgressDisplay';

export default {
  title: 'Display/ProgressDisplay',
  component: ProgressDisplay,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: 'number' },
    label: { control: 'text' },
    showPercentage: { control: 'boolean' },
  },
};

export const Default = { args: { value: 65, label: 'Progresso' } };
export const Complete = { args: { value: 100, label: 'Concluído' } };
export const Zero = { args: { value: 0, label: 'Por iniciar' } };
export const NoLabel = { args: { value: 40 } };
export const CustomMax = { args: { value: 7, max: 10, label: '7 de 10 tarefas' } };
export const NoPercentage = { args: { value: 55, label: 'Carregamento', showPercentage: false } };

export const MultipleMetrics = {
  name: 'Múltiplas métricas',
  render: () => (
    <div className="space-y-4 max-w-sm">
      <ProgressDisplay value={92} label="Armazenamento utilizado" />
      <ProgressDisplay value={45} label="CPU" />
      <ProgressDisplay value={18} label="Memória RAM" />
      <ProgressDisplay value={100} label="Deploy concluído" />
    </div>
  ),
};
