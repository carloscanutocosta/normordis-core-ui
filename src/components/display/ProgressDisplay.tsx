import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProgressDisplayProps {
  value?: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export default function ProgressDisplay({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  className,
}: ProgressDisplayProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('space-y-1.5', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && <span className="font-medium">{Math.round(pct)}%</span>}
        </div>
      )}
      <Progress value={pct} className="h-2" aria-label={label ?? 'Progresso'} />
    </div>
  );
}
