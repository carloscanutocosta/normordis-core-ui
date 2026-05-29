import React, { useId } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import FormField from './FormField';
import { cn } from '@/lib/utils';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupInputProps {
  id?: string;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  options?: Array<string | RadioOption>;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  className?: string;
}

export default function RadioGroupInput({
  id: idProp,
  label,
  description,
  error,
  required,
  value,
  onChange,
  options = [],
  orientation = 'vertical',
  disabled,
  className,
}: RadioGroupInputProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FormField
      id={id}
      label={label}
      description={description}
      error={error}
      required={required}
      className={className}
    >
      <RadioGroup
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        className={cn(orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2')}
      >
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const lab = typeof opt === 'string' ? opt : opt.label;
          const desc = typeof opt === 'object' ? opt.description : undefined;
          return (
            <label key={val} className="flex items-start gap-3 cursor-pointer">
              <RadioGroupItem value={val} className="mt-0.5" />
              <div>
                <Label className="cursor-pointer font-medium text-sm">{lab}</Label>
                {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
              </div>
            </label>
          );
        })}
      </RadioGroup>
    </FormField>
  );
}
