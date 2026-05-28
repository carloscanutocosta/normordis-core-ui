import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor, Contrast } from 'lucide-react';
import { THEMES, applyTheme, getStoredTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ICONS = { Sun, Moon, Monitor, Contrast };

export default function ThemeSwitcher({ className }) {
  const [active, setActive] = useState('light');

  useEffect(() => {
    const stored = getStoredTheme();
    setActive(stored);
    applyTheme(stored);
  }, []);

  const handleChange = (id) => {
    setActive(id);
    applyTheme(id);
  };

  return (
    <TooltipProvider>
      <div
        role="group"
        aria-label="Selecionar tema"
        className={cn(
          'inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm',
          className,
        )}
      >
        {THEMES.map(({ id, label, icon }) => {
          const Icon = ICONS[icon];
          const isActive = active === id;
          return (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-pressed={isActive}
                  aria-label={label}
                  onClick={() => handleChange(id)}
                  className={cn(
                    'flex items-center justify-center rounded-lg p-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">{label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">{label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
