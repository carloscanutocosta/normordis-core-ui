import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useWorkspace } from './WorkspaceContext';

export default function TabBar() {
  const { openTabs, activeApp, setActiveApp, closeTab } = useWorkspace();

  if (openTabs.length === 0) return null;

  return (
    <div
      role="tablist"
      aria-label="Apps abertas"
      className="h-9 bg-muted flex items-end border-b border-border select-none shrink-0 overflow-x-auto workspace-scroll"
    >
      {openTabs.map(tab => {
        const isActive = activeApp === tab.id;
        return (
          <div
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveApp(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-3 h-[34px] cursor-pointer group transition-colors border-r border-border',
              isActive
                ? 'bg-card text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50',
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute top-0 left-0 right-0 h-[2px] bg-primary"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="text-xs font-medium whitespace-nowrap">{tab.label}</span>
            {openTabs.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                aria-label={`Fechar ${tab.label}`}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-muted transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
