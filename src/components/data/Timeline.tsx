import React, { ComponentType } from 'react';
import { cn } from '@/lib/utils';
import { Check, Circle, AlertCircle, Clock } from 'lucide-react';

const STATUS_CONFIG = {
  completed: {
    icon: Check,
    dot: 'bg-primary border-primary text-primary-foreground',
    line: 'bg-primary',
  },
  active: {
    icon: Circle,
    dot: 'bg-background border-primary text-primary',
    line: 'bg-border',
  },
  error: {
    icon: AlertCircle,
    dot: 'bg-destructive border-destructive text-destructive-foreground',
    line: 'bg-border',
  },
  pending: {
    icon: Clock,
    dot: 'bg-background border-border text-muted-foreground',
    line: 'bg-border',
  },
};

function TimelineItem({ step, isLast, orientation }) {
  const config = STATUS_CONFIG[step.status] ?? STATUS_CONFIG.pending;
  const Icon = step.icon ?? config.icon;

  if (orientation === 'horizontal') {
    return (
      <div className="flex flex-col items-center flex-1">
        {/* Dot + connector line */}
        <div className="flex items-center w-full">
          {/* left line */}
          <div
            className={cn('flex-1 h-0.5', step.status === 'completed' ? 'bg-primary' : 'bg-border')}
          />
          <div
            className={cn(
              'h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10',
              config.dot,
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
          {/* right line */}
          {!isLast && (
            <div
              className={cn(
                'flex-1 h-0.5',
                step.status === 'completed' ? 'bg-primary' : 'bg-border',
              )}
            />
          )}
          {isLast && <div className="flex-1" />}
        </div>
        {/* Label */}
        <div className="mt-2 text-center px-1">
          <p
            className={cn(
              'text-xs font-medium',
              step.status === 'active'
                ? 'text-primary'
                : step.status === 'error'
                  ? 'text-destructive'
                  : 'text-foreground',
            )}
          >
            {step.label}
          </p>
          {step.description && (
            <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
          )}
          {step.timestamp && (
            <p className="text-xs text-muted-foreground/70 mt-0.5">{step.timestamp}</p>
          )}
        </div>
      </div>
    );
  }

  // vertical
  return (
    <div className="flex gap-3">
      {/* Dot + line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0',
            config.dot,
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
        {!isLast && <div className={cn('w-0.5 flex-1 mt-1 min-h-[24px]', config.line)} />}
      </div>
      {/* Content */}
      <div className={cn('pb-6', isLast && 'pb-0')}>
        <p
          className={cn(
            'text-sm font-medium leading-tight',
            step.status === 'active'
              ? 'text-primary'
              : step.status === 'error'
                ? 'text-destructive'
                : 'text-foreground',
          )}
        >
          {step.label}
        </p>
        {step.description && (
          <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
        )}
        {step.timestamp && (
          <p className="text-xs text-muted-foreground/70 mt-1">{step.timestamp}</p>
        )}
      </div>
    </div>
  );
}

interface TimelineStep {
  id?: string | number;
  label: string;
  description?: string;
  timestamp?: string;
  status?: 'completed' | 'active' | 'error' | 'pending';
  icon?: ComponentType<{ className?: string }>;
}

interface TimelineProps {
  steps?: TimelineStep[];
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export default function Timeline({
  steps = [],
  orientation = 'vertical',
  className,
}: TimelineProps) {
  return (
    <div
      className={cn(orientation === 'horizontal' ? 'flex items-start' : 'flex flex-col', className)}
    >
      {steps.map((step, i) => (
        <TimelineItem
          key={step.id ?? i}
          step={step}
          isLast={i === steps.length - 1}
          orientation={orientation}
        />
      ))}
    </div>
  );
}
