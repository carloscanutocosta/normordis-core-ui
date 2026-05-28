import Sparkline from './Sparkline';

export default {
  title: 'Charts/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  argTypes: {
    showTrend: { control: 'boolean' },
    width: { control: 'number' },
    height: { control: 'number' },
  },
};

const UP = [12, 18, 15, 22, 19, 28, 31, 27, 35];
const DOWN = [40, 35, 38, 30, 25, 22, 18, 20, 14];
const FLAT = [20, 22, 19, 21, 20, 23, 21, 22, 20];

export const Uptrend = { args: { data: UP, showTrend: true } };
export const Downtrend = { args: { data: DOWN, showTrend: true } };
export const Flat = { args: { data: FLAT, showTrend: true } };
export const NoTrend = { args: { data: UP } };
export const CustomColor = { args: { data: UP, color: 'hsl(var(--chart-3))', showTrend: true } };

export const InContext = {
  name: 'Em contexto (tabela)',
  render: () => (
    <div className="space-y-2">
      {[
        { label: 'Receita', data: UP, trend: '+12%' },
        { label: 'Utilizadores', data: FLAT, trend: '~0%' },
        { label: 'Churn', data: DOWN, trend: '-8%' },
      ].map(({ label, data, trend }) => (
        <div key={label} className="flex items-center gap-4 text-sm">
          <span className="w-24 text-muted-foreground">{label}</span>
          <Sparkline data={data} showTrend width={80} height={28} />
          <span className="text-xs font-medium">{trend}</span>
        </div>
      ))}
    </div>
  ),
};
