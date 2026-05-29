import React from 'react';
import { cn } from '@/lib/utils';

const variants = {
  heading: 'text-2xl font-bold text-foreground',
  subheading: 'text-lg font-semibold text-foreground',
  body: 'text-sm text-foreground',
  caption: 'text-xs text-muted-foreground',
  label: 'text-sm font-medium text-muted-foreground uppercase tracking-wider',
  code: 'font-mono text-sm bg-muted px-2 py-1 rounded',
};

interface TextDisplayProps {
  value: string | number | null | undefined;
  variant?: 'body' | 'heading' | 'subheading' | 'caption' | 'label' | 'code';
  className?: string;
}

export default function TextDisplay({ value, variant = 'body', className }: TextDisplayProps) {
  if (!value && value !== 0) return <span className="text-sm text-muted-foreground italic">—</span>;
  return <span className={cn(variants[variant], className)}>{value}</span>;
}
