import { Button } from './button';

export default {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
};

export const Default = { args: { children: 'Guardar' } };
export const Destructive = { args: { children: 'Eliminar', variant: 'destructive' } };
export const Outline = { args: { children: 'Cancelar', variant: 'outline' } };
export const Secondary = { args: { children: 'Secundário', variant: 'secondary' } };
export const Ghost = { args: { children: 'Ghost', variant: 'ghost' } };
export const Link = { args: { children: 'Saber mais', variant: 'link' } };
export const Small = { args: { children: 'Pequeno', size: 'sm' } };
export const Large = { args: { children: 'Grande', size: 'lg' } };
export const Disabled = { args: { children: 'Indisponível', disabled: true } };

export const AllVariants = {
  name: 'All variants',
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes = {
  name: 'All sizes',
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button size="lg">Large</Button>
      <Button size="default">Default</Button>
      <Button size="sm">Small</Button>
      <Button size="icon" aria-label="Icon button">
        +
      </Button>
    </div>
  ),
};
