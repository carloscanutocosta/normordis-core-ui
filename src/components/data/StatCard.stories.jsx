import { Users, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';
import StatCard from './StatCard';

export default {
  title: 'Data/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  argTypes: {
    trend: { control: 'number' },
    value: { control: 'text' },
    label: { control: 'text' },
    trendLabel: { control: 'text' },
  },
};

export const Default = { args: { label: 'Utilizadores activos', value: 1842, icon: Users } };
export const WithTrend = { args: { label: 'Receita mensal', value: 48200, prefix: '€ ', trend: 12.3, trendLabel: 'vs mês anterior', icon: DollarSign } };
export const NegativeTrend = { args: { label: 'Taxa de churn', value: '4,2%', trend: -1.8, trendLabel: 'vs mês anterior' } };
export const NoIcon = { args: { label: 'Encomendas', value: 284, trend: 5 } };
export const TextValue = { args: { label: 'Estado do sistema', value: 'Operacional', icon: TrendingUp } };

export const Dashboard = {
  name: 'Dashboard (4 cards)',
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <StatCard label="Receita" value={48200} prefix="€ " trend={12.3} trendLabel="vs mês ant." icon={DollarSign} />
      <StatCard label="Encomendas" value={284} trend={5.1} trendLabel="vs mês ant." icon={ShoppingCart} />
      <StatCard label="Utilizadores" value={1842} trend={2.7} trendLabel="vs mês ant." icon={Users} />
      <StatCard label="Churn" value="4,2%" trend={-1.8} trendLabel="vs mês ant." />
    </div>
  ),
};
