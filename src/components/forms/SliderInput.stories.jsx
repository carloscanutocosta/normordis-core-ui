import { useState } from 'react';
import SliderInput from './SliderInput';

export default {
  title: 'Forms/Inputs/SliderInput',
  component: SliderInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    showValue: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export const Default = {
  render: (args) => {
    const [value, setValue] = useState(50);
    return <SliderInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Volume', min: 0, max: 100 },
};

export const Percentage = {
  render: (args) => {
    const [value, setValue] = useState(75);
    return <SliderInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Desconto', min: 0, max: 100, suffix: '%', step: 5 },
};

export const Temperature = {
  render: (args) => {
    const [value, setValue] = useState(20);
    return <SliderInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Temperatura', min: 16, max: 30, suffix: '°C', step: 1 },
};

export const NoLabel = {
  render: (args) => {
    const [value, setValue] = useState(30);
    return <SliderInput {...args} value={value} onChange={setValue} />;
  },
  args: { min: 0, max: 100, showValue: false },
};
