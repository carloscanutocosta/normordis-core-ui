import Stepper from './Stepper';

export default {
  title: 'Data/Stepper',
  component: Stepper,
  tags: ['autodocs'],
};

const ONBOARDING_STEPS = [
  { label: 'Conta', description: 'Crie as suas credenciais de acesso.' },
  { label: 'Perfil', description: 'Complete as informações do seu perfil.' },
  { label: 'Organização', description: 'Configure a sua organização.' },
  { label: 'Conclusão', description: 'Tudo pronto. Bem-vindo!' },
];

const CHECKOUT_STEPS = [
  { label: 'Carrinho', description: 'Reveja os artigos seleccionados.' },
  { label: 'Envio', description: 'Escolha o método de envio.' },
  { label: 'Pagamento', description: 'Introduza os dados de pagamento.' },
  { label: 'Confirmação', description: 'Encomenda submetida com sucesso.' },
];

export const Onboarding = { args: { steps: ONBOARDING_STEPS } };
export const Checkout = { args: { steps: CHECKOUT_STEPS } };
export const TwoSteps = {
  args: {
    steps: [
      { label: 'Confirmar', description: 'Verifique os dados.' },
      { label: 'Concluir', description: 'Operação finalizada.' },
    ],
  },
};
