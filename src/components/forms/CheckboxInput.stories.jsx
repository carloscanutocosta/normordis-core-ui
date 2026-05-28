import { useState } from 'react';
import CheckboxInput from './CheckboxInput';

export default {
  title: 'Forms/Inputs/CheckboxInput',
  component: CheckboxInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export const Default = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <CheckboxInput {...args} checked={checked} onChange={setChecked} />;
  },
  args: { label: 'Aceito os termos e condições' },
};

export const WithDescription = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <CheckboxInput {...args} checked={checked} onChange={setChecked} />;
  },
  args: {
    label: 'Receber newsletter',
    description: 'Enviaremos novidades mensalmente. Pode cancelar a qualquer momento.',
  },
};

export const Checked = {
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return <CheckboxInput {...args} checked={checked} onChange={setChecked} />;
  },
  args: { label: 'Notificações activadas' },
};

export const Disabled = {
  args: { label: 'Opção indisponível', checked: false, disabled: true },
};

export const FormGroup = {
  name: 'Grupo de opções',
  render: () => {
    const [sel, setSel] = useState({ email: true, sms: false, push: true });
    return (
      <div className="space-y-3">
        <CheckboxInput
          label="Notificações por email"
          checked={sel.email}
          onChange={(v) => setSel((s) => ({ ...s, email: v }))}
        />
        <CheckboxInput
          label="Notificações por SMS"
          checked={sel.sms}
          onChange={(v) => setSel((s) => ({ ...s, sms: v }))}
        />
        <CheckboxInput
          label="Notificações push"
          checked={sel.push}
          onChange={(v) => setSel((s) => ({ ...s, push: v }))}
        />
      </div>
    );
  },
};
