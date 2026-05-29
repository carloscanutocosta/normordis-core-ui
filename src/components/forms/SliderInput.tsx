import React, { useId } from 'react';
import { Slider } from '@/components/ui/slider';
import FormField from './FormField';

interface SliderInputProps {
  id?: string;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  suffix?: string;
  disabled?: boolean;
  className?: string;
}

export default function SliderInput({
  id: idProp,
  label,
  description,
  error,
  required,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  suffix = '',
  disabled,
  className,
}: SliderInputProps) {
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
      <div className="space-y-3">
        {showValue && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {min}
              {suffix}
            </span>
            <span className="font-semibold text-primary">
              {value ?? min}
              {suffix}
            </span>
            <span className="text-muted-foreground">
              {max}
              {suffix}
            </span>
          </div>
        )}
        <Slider
          value={[value ?? min]}
          onValueChange={([val]) => onChange?.(val)}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          aria-label={label}
        />
      </div>
    </FormField>
  );
}
