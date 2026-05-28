import React from 'react';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const VARIANTS = {
  danger: {
    icon: AlertTriangle,
    iconClass: 'text-destructive',
    confirmClass: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-amber-500',
    confirmClass: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  info: { icon: Info, iconClass: 'text-primary', confirmClass: '' },
  success: {
    icon: CheckCircle2,
    iconClass: 'text-green-600',
    confirmClass: 'bg-green-600 hover:bg-green-700 text-white',
  },
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  const { icon: Icon, iconClass, confirmClass } = VARIANTS[variant] || VARIANTS.danger;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className={cn('mt-0.5 shrink-0', iconClass)}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">{title}</h3>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button size="sm" className={confirmClass} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
