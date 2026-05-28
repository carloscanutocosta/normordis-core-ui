import AreaChartComponent from './AreaChart';

export default {
  title: 'Charts/AreaChart',
  component: AreaChartComponent,
  tags: ['autodocs'],
  argTypes: {
    height: { control: { type: 'range', min: 150, max: 500, step: 10 } },
    stacked: { control: 'boolean' },
  },
};

const MONTHLY = [
  { month: 'Jan', receita: 4200, despesa: 2800 },
  { month: 'Fev', receita: 5100, despesa: 3100 },
  { month: 'Mar', receita: 4800, despesa: 2900 },
  { month: 'Abr', receita: 6200, despesa: 3500 },
  { month: 'Mai', receita: 5900, despesa: 3200 },
  { month: 'Jun', receita: 7100, despesa: 3800 },
];

export const Default = { args: { data: MONTHLY, xKey: 'month' } };
export const Stacked = { args: { data: MONTHLY, xKey: 'month', stacked: true } };
export const SingleSeries = {
  args: {
    data: MONTHLY.map(({ month, receita }) => ({ month, receita })),
    xKey: 'month',
  },
};
export const Tall = { args: { data: MONTHLY, xKey: 'month', height: 400 } };
