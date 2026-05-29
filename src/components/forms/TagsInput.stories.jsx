import { useState } from 'react';
import TagsInput from './TagsInput';

export default {
  title: 'Forms/Inputs/TagsInput',
  component: TagsInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};

export const Default = {
  render: (args) => {
    const [value, setValue] = useState([]);
    return <TagsInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Etiquetas', placeholder: 'Escrever e pressionar Enter...' },
};

export const WithValues = {
  render: (args) => {
    const [value, setValue] = useState(['urgente', 'contabilidade', 'Q2-2025']);
    return <TagsInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Tags do processo' },
};

export const WithError = {
  render: (args) => {
    const [value, setValue] = useState([]);
    return <TagsInput {...args} value={value} onChange={setValue} />;
  },
  args: { label: 'Categorias', error: 'Adicione pelo menos uma categoria.', required: true },
};

export const Disabled = {
  args: { label: 'Etiquetas', value: ['aprovado', 'publicado'], disabled: true },
};
