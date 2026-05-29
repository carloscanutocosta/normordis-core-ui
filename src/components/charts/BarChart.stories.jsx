import BarChartComponent from './BarChart';

export default {
  title: 'Charts/BarChart',
  component: BarChartComponent,
  tags: ['autodocs'],
  argTypes: {
    height: { control: { type: 'range', min: 150, max: 500, step: 10 } },
    horizontal: { control: 'boolean' },
    stacked: { control: 'boolean' },
  },
};

const DEPT_DATA = [
  { dept: 'Design', q1: 42, q2: 55, q3: 61 },
  { dept: 'Dev', q1: 78, q2: 82, q3: 90 },
  { dept: 'Marketing', q1: 35, q2: 48, q3: 52 },
  { dept: 'Suporte', q1: 28, q2: 31, q3: 40 },
];

export const Default = { args: { data: DEPT_DATA, xKey: 'dept' } };
export const Horizontal = { args: { data: DEPT_DATA, xKey: 'dept', horizontal: true } };
export const Stacked = { args: { data: DEPT_DATA, xKey: 'dept', stacked: true } };
export const StackedHorizontal = {
  args: { data: DEPT_DATA, xKey: 'dept', stacked: true, horizontal: true },
};
export const SingleSeries = {
  args: {
    data: DEPT_DATA.map(({ dept, q1 }) => ({ dept, q1 })),
    xKey: 'dept',
  },
};
