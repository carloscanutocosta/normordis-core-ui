import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({
  label,
  value,
  prefix = '',
  suffix = '',
  trend,
  trendLabel,
  icon: Icon,
  className,
}) {
  const trendPositive = trend > 0;
  const trendNeutral = trend === 0 || trend === undefined;
  const TrendIcon = trendNeutral ? Minus : trendPositive ? TrendingUp : TrendingDown;

  return (
    <div className={cn('rounded-xl border border-border bg-card p-4 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {Icon && (
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground tracking-tight">
        {prefix}
        {typeof value === 'number' ? value.toLocaleString('pt-PT') : value}
        {suffix}
      </p>
      {trend !== undefined && (
        <div
          className={cn(
            'flex items-center gap-1 text-xs font-medium',
            trendNeutral
              ? 'text-muted-foreground'
              : trendPositive
                ? 'text-green-600 dark:text-green-400'
                : 'text-destructive',
          )}
        >
          <TrendIcon className="h-3.5 w-3.5" />
          <span>
            {trendPositive ? '+' : ''}
            {trend}%
          </span>
          {trendLabel && (
            <span className="text-muted-foreground font-normal ml-1">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
