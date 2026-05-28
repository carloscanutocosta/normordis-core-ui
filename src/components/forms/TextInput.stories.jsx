import { useState } from 'react';
import { Mail } from 'lucide-react';
import TextInput from './TextInput';

export default {
  title: 'Forms/Inputs/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    description: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    value: { control: 'text' },
  },
};

export const Default = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Nome', placeholder: 'Introduza o nome' },
};

export const WithDescription = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Email', description: 'Será usado para notificações.', placeholder: 'nome@exemplo.pt' },
};

export const WithIcon = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Email', placeholder: 'nome@exemplo.pt', icon: Mail },
};

export const WithError = {
  render: (args) => {
    const [value, setValue] = useState('texto inválido');
    return <TextInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'NIF', error: 'NIF inválido. Deve ter 9 dígitos.', required: true },
};

export const Required = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Nome completo', required: true, placeholder: 'Introduza o nome completo' },
};

export const Disabled = {
  args: { label: 'Campo desactivado', value: 'Valor fixo', disabled: true },
};
