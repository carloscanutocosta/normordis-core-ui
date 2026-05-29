import { useState } from 'react';
import PasswordInput from './PasswordInput';

export default {
  title: 'Forms/Inputs/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};

export const Default = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <PasswordInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Palavra-passe' },
};

export const WithDescription = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <PasswordInput {...args} value={value} onChange={setValue} />;
  },
  args: {
    label: 'Nova palavra-passe',
    description: 'Mínimo 8 caracteres, com letra maiúscula e número.',
    required: true,
  },
};

export const WithError = {
  render: (args) => {
    const [value, setValue] = useState('abc');
    return <PasswordInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Palavra-passe', error: 'Mínimo de 8 caracteres.', required: true },
};

export const Disabled = {
  args: { label: 'Palavra-passe', value: '••••••••', disabled: true },
};
