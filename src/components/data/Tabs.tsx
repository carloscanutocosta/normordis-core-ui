import React, { ComponentType, ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  content?: ReactNode;
  icon?: ComponentType<{ className?: string }>;
}

interface TabsProps {
  tabs?: TabItem[];
  className?: string;
}

// ── Pill Tabs ──────────────────────────────────────────────────────────────
export function PillTabs({ tabs = [], className }: TabsProps) {
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find((t) => t.id === active);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              active === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/70',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="text-sm text-muted-foreground">{current?.content}</div>
    </div>
  );
}

// ── Underline Tabs ─────────────────────────────────────────────────────────
export function UnderlineTabs({ tabs = [], className }: TabsProps) {
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find((t) => t.id === active);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex border-b border-border gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
              active === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="text-sm text-muted-foreground">{current?.content}</div>
    </div>
  );
}

// ── Vertical Tabs ──────────────────────────────────────────────────────────
export function VerticalTabs({ tabs = [], className }: TabsProps) {
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find((t) => t.id === active);
  const Icon = current?.icon;

  return (
    <div className={cn('flex gap-4', className)}>
      <div className="flex flex-col gap-1 min-w-[140px] border-r border-border pr-3">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left',
                active === tab.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {TabIcon && <TabIcon className="h-4 w-4 shrink-0" />}
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="flex-1 text-sm text-muted-foreground pt-1">{current?.content}</div>
    </div>
  );
}
