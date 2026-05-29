import { useState } from 'react';
import NumberInput from './NumberInput';

export default {
  title: 'Forms/Inputs/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    showStepper: { control: 'boolean' },
  },
};

export const Default = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <NumberInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Quantidade', placeholder: '0' },
};

export const WithStepper = {
  render: (args) => {
    const [value, setValue] = useState(1);
    return <NumberInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Quantidade', showStepper: true, min: 1, max: 99 },
};

export const Currency = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <NumberInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Valor', prefix: '€', placeholder: '0.00' },
};

export const Percentage = {
  render: (args) => {
    const [value, setValue] = useState(0);
    return <NumberInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Desconto', suffix: '%', min: 0, max: 100, step: 5 },
};

export const WithError = {
  render: (args) => {
    const [value, setValue] = useState(-1);
    return <NumberInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Stock', error: 'O valor não pode ser negativo.', min: 0 },
};
