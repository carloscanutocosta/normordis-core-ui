import { useState } from 'react';
import SearchInput from './SearchInput';

export default {
  title: 'Forms/Inputs/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export const Default = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <SearchInput {...args} value={value} onChange={setValue} />;
  },
  args: { placeholder: 'Pesquisar...' },
};

export const WithValue = {
  render: (args) => {
    const [value, setValue] = useState('relatório mensal');
    return <SearchInput {...args} value={value} onChange={setValue} />;
  },
  args: { placeholder: 'Pesquisar documentos...' },
};

export const Disabled = {
  args: { value: '', disabled: true, placeholder: 'Pesquisa desactivada' },
};
