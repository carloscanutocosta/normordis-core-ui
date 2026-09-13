import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayButton, DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// Num intervalo (mode="range"), o react-day-picker marca cada dia do meio
// como `selected` E `range_middle` ao mesmo tempo. Se a cor vier de duas
// classes CSS com a mesma especificidade aplicadas ao mesmo elemento (como
// acontecia antes), quem "ganha" depende da ordem em que o Tailwind emite as
// regras no ficheiro final — não da intenção do código. Por isso a cor é
// decidida aqui, em JS, com prioridade explícita e mutuamente exclusiva.
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const isSingleSelected = modifiers.selected && !modifiers.range_middle;

  return (
    <button
      ref={ref}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'h-8 w-8 p-0 font-normal',
        modifiers.today && !modifiers.selected && 'bg-accent text-accent-foreground',
        modifiers.range_middle && 'rounded-none bg-accent text-accent-foreground',
        isSingleSelected &&
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        modifiers.range_start && 'rounded-l-md rounded-r-none',
        modifiers.range_end && 'rounded-r-md rounded-l-none',
        className,
      )}
      {...props}
    />
  );
}

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
        // <button> ("day_button") é filho direto. A cor de fundo do dia
        // (selected/today/range_*) é decidida em CalendarDayButton, em JS,
        // não aqui: um dia pode ser simultaneamente "selected" e
        // "range_middle" num intervalo, e duas classes CSS com a mesma
        // especificidade no mesmo elemento dependeriam da ordem de emissão
        // do Tailwind, não da intenção do código.
        day: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
        outside:
          'text-muted-foreground aria-selected:[&>button]:bg-accent/50 aria-selected:[&>button]:text-muted-foreground',
        disabled: 'text-muted-foreground opacity-50',
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
        DayButton: CalendarDayButton,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
