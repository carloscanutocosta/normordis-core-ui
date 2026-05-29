import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useWorkspace } from './WorkspaceContext';

export default function RightRail() {
  const { rightTools, activeTool, toggleTool } = useWorkspace();

  if (!rightTools.length) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        aria-label="Ferramentas"
        className="w-12 h-full bg-sidebar flex flex-col items-center py-2 border-l border-sidebar-border select-none shrink-0"
      >
        <div className="flex flex-col gap-1">
          {rightTools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => toggleTool(tool.id)}
                    aria-pressed={isActive}
                    aria-label={tool.label}
                    className={cn(
                      'relative w-9 h-9 rounded-md flex items-center justify-center transition-all',
                      isActive
                        ? 'text-sidebar-primary bg-sidebar-accent'
                        : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent',
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="rightRailIndicator"
                        className="absolute right-0 top-1 bottom-1 w-[2px] bg-sidebar-primary rounded-l"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    {Icon && <Icon className="w-[18px] h-[18px]" aria-hidden="true" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{tool.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </aside>
    </TooltipProvider>
  );
}
