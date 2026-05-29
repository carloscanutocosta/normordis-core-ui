import NumberDisplay from './NumberDisplay';

export default {
  title: 'Display/NumberDisplay',
  component: NumberDisplay,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'large', 'currency', 'compact', 'positive', 'negative'],
    },
    value: { control: 'number' },
    decimals: { control: 'number' },
  },
};

export const Default = { args: { value: 1234.56 } };
export const Large = { args: { value: 48392, variant: 'large' } };
export const Currency = { args: { value: 9850.0, prefix: '€ ', decimals: 2, variant: 'currency' } };
export const Compact = { args: { value: 72, suffix: '%', decimals: 0, variant: 'compact' } };
export const Positive = { args: { value: 12.5, suffix: '%', decimals: 1, variant: 'positive' } };
export const Negative = { args: { value: -3.2, suffix: '%', decimals: 1, variant: 'negative' } };
export const Empty = { args: { value: null }, name: 'Vazio (null)' };

export const Dashboard = {
  name: 'Contexto dashboard',
  render: () => (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <NumberDisplay value={124500} prefix="€ " decimals={0} variant="large" />
        <NumberDisplay value={8.3} suffix="%" decimals={1} variant="positive" />
      </div>
      <div className="flex gap-4">
        <NumberDisplay value={1842} decimals={0} variant="compact" suffix=" clientes" />
        <NumberDisplay value={0.934} decimals={3} variant="compact" />
      </div>
    </div>
  ),
};
