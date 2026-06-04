import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    /** Aria-label para o thumb (obrigatório para acessibilidade quando não há label visível). */
    'aria-label'?: string;
    /** Propaga aria-describedby diretamente ao thumb — o Radix Root não o faz automaticamente. */
    'aria-describedby'?: string;
    /** Propaga aria-invalid ao thumb. */
    'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling';
  }
>(
  (
    {
      className,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {/* Os atributos ARIA são aplicados ao Thumb porque é o elemento interativo
        com role="slider" — o Root não é focável e não é anunciado por leitores de ecrã. */}
      <SliderPrimitive.Thumb
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid}
        className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      />
    </SliderPrimitive.Root>
  ),
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
