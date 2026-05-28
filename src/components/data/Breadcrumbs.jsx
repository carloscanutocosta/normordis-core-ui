import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Breadcrumbs({ items = [], className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm', className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <React.Fragment key={item.label}>
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
            {isLast ? (
              <span className="font-medium text-foreground truncate">{item.label}</span>
            ) : (
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors truncate"
              >
                {i === 0 && item.icon !== false ? <Home className="h-3.5 w-3.5" /> : item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
