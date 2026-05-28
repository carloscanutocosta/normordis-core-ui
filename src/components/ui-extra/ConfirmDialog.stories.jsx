import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ConfirmDialog from './ConfirmDialog';

export default {
  title: 'UI Extra/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['danger', 'warning', 'info', 'success'] },
    open: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
    confirmLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
  },
};

export const Danger = {
  args: {
    open: true,
    variant: 'danger',
    title: 'Eliminar registo',
    description: 'Esta acção é irreversível. O registo será eliminado permanentemente.',
    confirmLabel: 'Eliminar',
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const Warning = {
  args: {
    open: true,
    variant: 'warning',
    title: 'Publicar alterações',
    description: 'As alterações ficarão visíveis para todos os utilizadores de imediato.',
    confirmLabel: 'Publicar',
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const Info = {
  args: {
    open: true,
    variant: 'info',
    title: 'Confirmar subscrição',
    description: 'Será cobrado €9,90/mês a partir de amanhã.',
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const Interactive = {
  name: 'Interactivo (com botão)',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-4">
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Eliminar conta
        </Button>
        <ConfirmDialog
          open={open}
          variant="danger"
          title="Eliminar conta"
          description="Todos os seus dados serão eliminados permanentemente. Esta acção não pode ser revertida."
          confirmLabel="Eliminar conta"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
};
