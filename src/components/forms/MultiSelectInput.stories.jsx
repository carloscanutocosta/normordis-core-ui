import { useState } from 'react';
import MultiSelectInput from './MultiSelectInput';

export default {
  title: 'Forms/Inputs/MultiSelectInput',
  component: MultiSelectInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};

const PERMISSIONS = [
  { value: 'read', label: 'Leitura' },
  { value: 'write', label: 'Escrita' },
  { value: 'delete', label: 'Eliminação' },
  { value: 'admin', label: 'Administração' },
  { value: 'export', label: 'Exportação' },
];

const CATEGORIES = ['Financeiro', 'Recursos Humanos', 'Operações', 'Tecnologia', 'Marketing', 'Jurídico'];

export const Default = {
  render: (args) => {
    const [value, setValue] = useState([]);
    return <MultiSelectInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Permissões', options: PERMISSIONS },
};

export const WithValues = {
  render: (args) => {
    const [value, setValue] = useState(['read', 'write']);
    return <MultiSelectInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Permissões', options: PERMISSIONS },
};

export const StringOptions = {
  render: (args) => {
    const [value, setValue] = useState([]);
    return <MultiSelectInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Departamentos', options: CATEGORIES },
};

export const WithError = {
  render: (args) => {
    const [value, setValue] = useState([]);
    return <MultiSelectInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Categorias', options: CATEGORIES, error: 'Seleccione pelo menos uma categoria.', required: true },
};

export const Disabled = {
  args: { label: 'Permissões', options: PERMISSIONS, value: ['read', 'write'], disabled: true },
};
