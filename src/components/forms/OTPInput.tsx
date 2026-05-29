import React, { useRef } from 'react';
import FormField from './FormField';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  length?: number;
  disabled?: boolean;
  className?: string;
}

export default function OTPInput({
  label,
  description,
  error,
  required,
  value = '',
  onChange,
  length = 6,
  disabled,
  className,
}) {
  const inputsRef = useRef([]);
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  const handleChange = (index, char) => {
    const newDigits = [...digits];
    newDigits[index] = char.replace(/\D/g, '').slice(-1);
    onChange(newDigits.join(''));
    if (char && index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted.padEnd(length, '').slice(0, length));
    e.preventDefault();
  };

  return (
    <FormField
      label={label}
      description={description}
      error={error}
      required={required}
      className={className}
    >
      <div
        className="flex gap-2"
        onPaste={handlePaste}
        role="group"
        aria-label={label ?? 'Código OTP'}
      >
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={disabled}
            aria-label={`Dígito ${i + 1} de ${length}`}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={cn(
              'w-10 h-12 text-center text-lg font-semibold rounded-md border border-input bg-background text-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-destructive',
              'transition-all',
            )}
          />
        ))}
      </div>
    </FormField>
  );
}
