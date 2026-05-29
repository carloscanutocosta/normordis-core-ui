import AlertBanner from './AlertBanner';

export default {
  title: 'Data/AlertBanner',
  component: AlertBanner,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    dismissible: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
  },
};

export const Info = {
  args: {
    variant: 'info',
    title: 'Nova versão disponível',
    description: 'A versão 2.0 inclui melhorias de desempenho e novos componentes.',
  },
};
export const Success = {
  args: {
    variant: 'success',
    title: 'Configuração guardada',
    description: 'As alterações foram aplicadas com sucesso.',
  },
};
export const Warning = {
  args: {
    variant: 'warning',
    title: 'Sessão a expirar',
    description: 'A sua sessão expira em 5 minutos. Guarde o trabalho pendente.',
  },
};
export const Error = {
  args: {
    variant: 'error',
    title: 'Erro de sincronização',
    description: 'Não foi possível sincronizar os dados. Verifique a ligação à internet.',
  },
};
export const Dismissible = {
  args: {
    variant: 'info',
    title: 'Novidade',
    description: 'Pode dispensar este aviso clicando no X.',
    dismissible: true,
  },
};
export const TitleOnly = { args: { variant: 'warning', title: 'Modo de manutenção activo' } };

export const AllVariants = {
  name: 'Todas as variantes',
  render: () => (
    <div className="space-y-3">
      <AlertBanner
        variant="info"
        title="Informação"
        description="Mensagem informativa para o utilizador."
      />
      <AlertBanner
        variant="success"
        title="Sucesso"
        description="A operação foi concluída com êxito."
      />
      <AlertBanner
        variant="warning"
        title="Aviso"
        description="Atenção, verifique os dados antes de continuar."
        dismissible
      />
      <AlertBanner
        variant="error"
        title="Erro"
        description="Ocorreu um problema. Tente novamente."
        dismissible
      />
    </div>
  ),
};
