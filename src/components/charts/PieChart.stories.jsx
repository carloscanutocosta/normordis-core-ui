import PieChartComponent from './PieChart';

export default {
  title: 'Charts/PieChart',
  component: PieChartComponent,
  tags: ['autodocs'],
  argTypes: {
    height: { control: { type: 'range', min: 150, max: 500, step: 10 } },
    donut: { control: 'boolean' },
  },
};

const TRAFFIC = [
  { name: 'Direto', value: 34 },
  { name: 'Orgânico', value: 28 },
  { name: 'Referência', value: 18 },
  { name: 'Email', value: 12 },
  { name: 'Social', value: 8 },
];

export const Default = { args: { data: TRAFFIC } };
export const Donut = { args: { data: TRAFFIC, donut: true } };
export const FewSlices = {
  args: {
    data: [
      { name: 'Aprovado', value: 62 },
      { name: 'Pendente', value: 28 },
      { name: 'Rejeitado', value: 10 },
    ],
  },
};
