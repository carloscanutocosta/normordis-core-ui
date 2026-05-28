import { useState } from 'react';
import TextField from './TextField';

export default {
  title: 'Forms/Fields/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    hint: { control: 'text' },
    multiline: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
  },
};

export const Default = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextField {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
  args: { label: 'Designação', placeholder: 'Introduza a designação' },
};

export const WithHint = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextField {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
  args: { label: 'Código postal', hint: 'Formato: XXXX-XXX', placeholder: '1000-001' },
};

export const WithError = {
  render: (args) => {
    const [value, setValue] = useState('abc');
    return <TextField {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
  args: { label: 'Código postal', error: 'Formato inválido. Use XXXX-XXX.' },
};

export const Multiline = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextField {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
  args: { label: 'Observações', multiline: true, rows: 4, placeholder: 'Notas adicionais...' },
};

export const WithPrefix = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextField {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
  args: { label: 'Website', prefix: 'https://', placeholder: 'empresa.pt' },
};

export const WithSuffix = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextField {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
  args: { label: 'Email corporativo', suffix: '@empresa.pt', placeholder: 'utilizador' },
};

export const ReadOnly = {
  args: { label: 'Criado em', value: '15/03/2025', readOnly: true },
};
