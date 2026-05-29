import { useState } from 'react';
import RatingInput from './RatingInput';

export default {
  title: 'Forms/Inputs/RatingInput',
  component: RatingInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    max: { control: { type: 'range', min: 3, max: 10, step: 1 } },
    disabled: { control: 'boolean' },
  },
};

export const Default = {
  render: (args) => {
    const [value, setValue] = useState(0);
    return <RatingInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Avaliação' },
};

export const WithValue = {
  render: (args) => {
    const [value, setValue] = useState(4);
    return <RatingInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Satisfação' },
};

export const TenStar = {
  render: (args) => {
    const [value, setValue] = useState(7);
    return <RatingInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Pontuação (0-10)', max: 10 },
};

export const Disabled = {
  args: { label: 'Avaliação final', value: 4, disabled: true },
};
