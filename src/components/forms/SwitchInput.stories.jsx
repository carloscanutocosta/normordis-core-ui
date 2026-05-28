import { useState } from 'react';
import SwitchInput from './SwitchInput';

export default {
  title: 'Forms/Inputs/SwitchInput',
  component: SwitchInput,
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
    return <SwitchInput {...args} checked={checked} onChange={setChecked} />;
  },
  args: { label: 'Notificações por email' },
};

export const WithDescription = {
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return <SwitchInput {...args} checked={checked} onChange={setChecked} />;
  },
  args: {
    label: 'Modo escuro',
    description: 'Activa a interface em modo escuro em todos os dispositivos.',
  },
};

export const Disabled = {
  args: {
    label: 'Funcionalidade beta',
    description: 'Disponível em breve.',
    checked: false,
    disabled: true,
  },
};

export const SettingsPanel = {
  name: 'Painel de definições',
  render: () => {
    const [notifs, setNotifs] = useState(true);
    const [dark, setDark] = useState(false);
    const [beta, setBeta] = useState(false);
    return (
      <div className="space-y-4 max-w-sm">
        <SwitchInput
          label="Notificações por email"
          description="Receba actualizações no seu email."
          checked={notifs}
          onChange={setNotifs}
        />
        <SwitchInput label="Modo escuro" checked={dark} onChange={setDark} />
        <SwitchInput
          label="Funcionalidades beta"
          description="Acesso antecipado a novas funcionalidades."
          checked={beta}
          onChange={setBeta}
        />
      </div>
    );
  },
};
