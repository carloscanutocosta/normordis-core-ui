import Timeline from './Timeline';

export default {
  title: 'Data/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
  },
};

const PROCESS_STEPS = [
  { id: 1, label: 'Submissão', description: 'Processo submetido pelo requerente.', timestamp: '10 Jan 09:12', status: 'completed' },
  { id: 2, label: 'Análise', description: 'Em análise pelo departamento técnico.', timestamp: '12 Jan 14:30', status: 'completed' },
  { id: 3, label: 'Aprovação', description: 'Aguarda aprovação de chefia.', timestamp: '15 Jan', status: 'active' },
  { id: 4, label: 'Despacho', description: 'Publicação do despacho final.', status: 'pending' },
];

const ERROR_STEPS = [
  { id: 1, label: 'Iniciado', description: 'Deploy iniciado.', status: 'completed' },
  { id: 2, label: 'Build', description: 'Compilação concluída.', status: 'completed' },
  { id: 3, label: 'Testes', description: 'Falha nos testes de integração.', status: 'error' },
  { id: 4, label: 'Produção', description: 'Deploy cancelado.', status: 'pending' },
];

export const Vertical = { args: { steps: PROCESS_STEPS, orientation: 'vertical' } };
export const Horizontal = { args: { steps: PROCESS_STEPS, orientation: 'horizontal' } };
export const WithError = { args: { steps: ERROR_STEPS, orientation: 'vertical' } };
export const Short = {
  args: {
    steps: [
      { id: 1, label: 'Criado', status: 'completed' },
      { id: 2, label: 'Activo', status: 'active' },
    ],
    orientation: 'vertical',
  },
};
