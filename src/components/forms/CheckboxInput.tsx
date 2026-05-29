import React, { useId } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import FormField from './FormField';

interface CheckboxInputProps {
  id?: string;
  label?: string;
  description?: string;
  error?: string;
  checked?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function CheckboxInput({
  id: idProp,
  label,
  description,
  error,
  checked,
  onChange,
  disabled,
  className,
}: CheckboxInputProps) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <FormField error={error} className={className}>
      <div className="flex items-start gap-3">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          className="mt-0.5"
        />
        <div className="space-y-0.5">
          {label && (
            <Label
              htmlFor={id}
              className="cursor-pointer font-medium text-sm hover:text-primary transition-colors"
            >
              {label}
            </Label>
          )}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
    </FormField>
  );
}
