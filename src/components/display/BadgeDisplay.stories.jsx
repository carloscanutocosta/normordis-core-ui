import { CheckCircle2, AlertTriangle, Info as InfoIcon } from 'lucide-react';
import BadgeDisplay from './BadgeDisplay';

export default {
  title: 'Display/BadgeDisplay',
  component: BadgeDisplay,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'error', 'info', 'neutral'],
    },
    value: { control: 'text' },
  },
};

export const Default = { args: { value: 'Rascunho' } };
export const Primary = { args: { value: 'Activo', color: 'primary' } };
export const Success = { args: { value: 'Aprovado', color: 'success' } };
export const Warning = { args: { value: 'Pendente', color: 'warning' } };
export const InfoBadge = { args: { value: 'Em revisão', color: 'info' }, name: 'Info' };
export const ErrorBadge = { args: { value: 'Rejeitado', color: 'error' }, name: 'Error' };
export const Neutral = { args: { value: 'Arquivado', color: 'neutral' } };
export const WithIcon = { args: { value: 'Aprovado', color: 'success', icon: CheckCircle2 } };
export const Empty = { args: { value: '' }, name: 'Vazio (não renderiza)' };

export const AllColors = {
  name: 'Todas as cores',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <BadgeDisplay value="Default" />
      <BadgeDisplay value="Primary" color="primary" />
      <BadgeDisplay value="Sucesso" color="success" icon={CheckCircle2} />
      <BadgeDisplay value="Aviso" color="warning" icon={AlertTriangle} />
      <BadgeDisplay value="Erro" color="error" />
      <BadgeDisplay value="Info" color="info" icon={InfoIcon} />
      <BadgeDisplay value="Neutro" color="neutral" />
    </div>
  ),
};
