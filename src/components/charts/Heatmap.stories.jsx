import Heatmap from './Heatmap';

export default {
  title: 'Charts/Heatmap',
  component: Heatmap,
  tags: ['autodocs'],
};

export const Default = { args: {} };

export const LowActivity = {
  name: 'Actividade baixa',
  args: {
    data: Array(7)
      .fill(null)
      .map(() =>
        Array(12)
          .fill(null)
          .map(() => Math.floor(Math.random() * 20)),
      ),
  },
};

export const HighActivity = {
  name: 'Actividade alta',
  args: {
    data: Array(7)
      .fill(null)
      .map(() =>
        Array(12)
          .fill(null)
          .map(() => Math.floor(Math.random() * 100) + 50),
      ),
  },
};
