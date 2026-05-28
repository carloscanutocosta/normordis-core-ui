import React, { useId, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import FormField from './FormField';
import { cn } from '@/lib/utils';

export default function PasswordInput({
  id: idProp,
  label,
  description,
  error,
  required,
  value,
  onChange,
  placeholder = '••••••••',
  disabled,
  className,
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const [show, setShow] = useState(false);

  return (
    <FormField
      id={id}
      label={label}
      description={description}
      error={error}
      required={required}
      className={className}
    >
      <div className="relative">
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn('h-10 pr-10', error && 'border-destructive')}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={show ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
          className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    </FormField>
  );
}
