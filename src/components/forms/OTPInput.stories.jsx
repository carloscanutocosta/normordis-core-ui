import { useState } from 'react';
import OTPInput from './OTPInput';

export default {
  title: 'Forms/Inputs/OTPInput',
  component: OTPInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    length: { control: { type: 'range', min: 4, max: 8, step: 1 } },
    disabled: { control: 'boolean' },
  },
};

export const Default = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <OTPInput {...args} value={value} onChange={setValue} />;
  },
  args: {
    label: 'Código de verificação',
    description: 'Introduza o código enviado para o seu email.',
  },
};

export const FourDigit = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <OTPInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'PIN', length: 4 },
};

export const WithError = {
  render: (args) => {
    const [value, setValue] = useState('123456');
    return <OTPInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Código de verificação', error: 'Código inválido. Tente novamente.' },
};

export const Disabled = {
  args: { label: 'Código', value: '483921', disabled: true },
};
