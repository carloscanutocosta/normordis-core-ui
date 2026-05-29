import React, { useId } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import FormField from './FormField';

interface SwitchInputProps {
  id?: string;
  label?: string;
  description?: string;
  error?: string;
  checked?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function SwitchInput({
  id: idProp,
  label,
  description,
  error,
  checked,
  onChange,
  disabled,
  className,
}: SwitchInputProps) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <FormField error={error} className={className}>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          {label && (
            <Label htmlFor={id} className="font-medium text-sm cursor-pointer">
              {label}
            </Label>
          )}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <Switch id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
      </div>
    </FormField>
  );
}
