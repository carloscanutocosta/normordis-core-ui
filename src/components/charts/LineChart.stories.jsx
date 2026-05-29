import LineChartComponent from './LineChart';

export default {
  title: 'Charts/LineChart',
  component: LineChartComponent,
  tags: ['autodocs'],
  argTypes: {
    height: { control: { type: 'range', min: 150, max: 500, step: 10 } },
  },
};

const WEEKLY = [
  { week: 'S1', visitas: 320, conversoes: 24 },
  { week: 'S2', visitas: 410, conversoes: 31 },
  { week: 'S3', visitas: 390, conversoes: 28 },
  { week: 'S4', visitas: 510, conversoes: 45 },
  { week: 'S5', visitas: 480, conversoes: 39 },
  { week: 'S6', visitas: 620, conversoes: 58 },
];

export const Default = { args: { data: WEEKLY, xKey: 'week' } };
export const SingleSeries = {
  args: {
    data: WEEKLY.map(({ week, visitas }) => ({ week, visitas })),
    xKey: 'week',
  },
};
export const Tall = { args: { data: WEEKLY, xKey: 'week', height: 400 } };
