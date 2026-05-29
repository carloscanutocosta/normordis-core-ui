import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DateDisplayProps {
  value: string | Date | null | undefined;
  dateFormat?: string;
  showRelative?: boolean;
  className?: string;
}

export default function DateDisplay({
  value,
  dateFormat = 'dd/MM/yyyy',
  showRelative = false,
  className,
}: DateDisplayProps) {
  if (!value) return <span className="text-sm text-muted-foreground italic">—</span>;

  const date = new Date(value);
  const formatted = format(date, dateFormat, { locale: ptBR });
  const relative = showRelative
    ? formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
    : null;

  return (
    <span className={cn('text-sm text-foreground', className)}>
      {formatted}
      {relative && <span className="text-xs text-muted-foreground ml-2">({relative})</span>}
    </span>
  );
}
