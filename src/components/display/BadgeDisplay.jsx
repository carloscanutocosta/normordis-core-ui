import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const colorMap = {
  default: '',
  primary: 'bg-primary text-primary-foreground',
  success: 'bg-green-100 text-green-700 border-green-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  error: 'bg-red-100 text-red-700 border-red-200',
  info: 'bg-blue-100 text-blue-700 border-blue-200',
  neutral: 'bg-muted text-muted-foreground',
};

export default function BadgeDisplay({ value, color = 'default', icon: Icon, className }) {
  if (!value) return null;
  return (
    <Badge variant="outline" className={cn('text-xs font-medium', colorMap[color], className)}>
      {Icon && <Icon className="h-3 w-3 mr-1" />}
      {value}
    </Badge>
  );
}
