import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import FieldWrapper from './FieldWrapper';

export default function RatingField({
  label,
  hint,
  error,
  required,
  value = 0,
  onChange,
  disabled,
  max = 5,
  size = 'md',
  className,
}) {
  const [hover, setHover] = useState(null);

  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };

  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required} className={className}>
      <div className="flex items-center gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && onChange?.(star === value ? 0 : star)}
            onMouseEnter={() => !disabled && setHover(star)}
            onMouseLeave={() => setHover(null)}
            disabled={disabled}
            className={cn(
              'transition-all focus:outline-none',
              !disabled && 'hover:scale-110 cursor-pointer',
              disabled && 'cursor-not-allowed opacity-60',
            )}
          >
            <Star
              className={cn(
                sizes[size],
                'transition-colors',
                (hover ?? value) >= star
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-transparent text-muted-foreground',
              )}
            />
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm text-muted-foreground tabular-nums">
            {value}/{max}
          </span>
        )}
      </div>
    </FieldWrapper>
  );
}
