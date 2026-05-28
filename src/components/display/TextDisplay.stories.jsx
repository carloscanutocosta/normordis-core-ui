import TextDisplay from './TextDisplay';

export default {
  title: 'Display/TextDisplay',
  component: TextDisplay,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['body', 'heading', 'subheading', 'caption', 'label', 'code'],
    },
    value: { control: 'text' },
  },
};

export const Body = { args: { value: 'Texto de corpo normal', variant: 'body' } };
export const Heading = { args: { value: 'Título Principal', variant: 'heading' } };
export const Subheading = { args: { value: 'Subtítulo de Secção', variant: 'subheading' } };
export const Caption = { args: { value: 'Legenda ou nota de rodapé', variant: 'caption' } };
export const Label = { args: { value: 'Campo obrigatório', variant: 'label' } };
export const Code = { args: { value: 'npm install @normordis/core-ui', variant: 'code' } };
export const Empty = { args: { value: null }, name: 'Vazio (null)' };

export const AllVariants = {
  name: 'Todas as variantes',
  render: () => (
    <div className="space-y-3">
      <TextDisplay value="Heading — título principal" variant="heading" />
      <TextDisplay value="Subheading — subtítulo de secção" variant="subheading" />
      <TextDisplay value="Body — texto de corpo corrido com informação detalhada" variant="body" />
      <TextDisplay value="Caption — nota auxiliar discreta" variant="caption" />
      <TextDisplay value="LABEL FIELD" variant="label" />
      <TextDisplay value="const x = require('core-ui')" variant="code" />
      <TextDisplay value={null} />
    </div>
  ),
};
