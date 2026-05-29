import { useState } from 'react';
import SelectInput from './SelectInput';

export default {
  title: 'Forms/Inputs/SelectInput',
  component: SelectInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    description: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};

const ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'manager', label: 'Gestor' },
  { value: 'analyst', label: 'Analista' },
  { value: 'viewer', label: 'Observador' },
];

const COUNTRIES = ['Portugal', 'Brasil', 'Espanha', 'França', 'Alemanha'];

export const Default = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <SelectInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Função', options: ROLES },
};

export const StringOptions = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <SelectInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'País', options: COUNTRIES },
};

export const WithDescription = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <SelectInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Função', options: ROLES, description: 'Define as permissões do utilizador.' },
};

export const WithError = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <SelectInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Função', options: ROLES, error: 'Campo obrigatório.', required: true },
};

export const Disabled = {
  args: { label: 'Função', options: ROLES, value: 'manager', disabled: true },
};
