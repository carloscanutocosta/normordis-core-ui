import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// Nomenclatura de classNames/components alinhada com react-day-picker v9+/v10
// (enum UI): "caption"→"month_caption", "nav_button_*"→"button_previous"/
// "button_next", "day_range_*"→"range_*", IconLeft/IconRight→Chevron único.
// Ver https://daypicker.dev/upgrading para o mapeamento completo.
function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        month_caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        month_grid: 'w-full border-collapse space-y-1',
        weekdays: 'flex',
        weekday: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        week: 'flex w-full mt-2',
        // NOTA: na v9+/v10 do react-day-picker, aria-selected/data-selected e
        // as classes de modificador (selected/outside/range_*) são todas
        // aplicadas ao PRÓPRIO <td> ("day"), não a um descendente — só o
        // <button> ("day_button") é filho direto. Por isso os estilos de
        // fundo/arredondamento usam `[&>button]` (filho direto) em vez de
        // `:has(...)`, que procuraria um descendente e nunca corresponderia.
        day: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 font-normal aria-selected:opacity-100',
        ),
        range_start: '[&>button]:rounded-l-md rounded-l-md',
        range_end: '[&>button]:rounded-r-md rounded-r-md',
        selected:
          '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground [&>button]:focus:bg-primary [&>button]:focus:text-primary-foreground',
        today: '[&>button]:bg-accent [&>button]:text-accent-foreground',
        outside:
          'text-muted-foreground aria-selected:[&>button]:bg-accent/50 aria-selected:[&>button]:text-muted-foreground',
        disabled: 'text-muted-foreground opacity-50',
        range_middle:
          '[&>button]:bg-accent [&>button]:text-accent-foreground [&>button]:rounded-none',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ className: cls, orientation, ...iconProps }) =>
          orientation === 'right' ? (
            <ChevronRight className={cn('h-4 w-4', cls)} {...iconProps} />
          ) : (
            <ChevronLeft className={cn('h-4 w-4', cls)} {...iconProps} />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
