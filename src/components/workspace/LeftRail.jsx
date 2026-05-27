import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspace } from './WorkspaceContext';

export default function LeftRail() {
  const { apps, activeApp, openApp, leftRailCollapsed, setLeftRailCollapsed } = useWorkspace();

  const coreApps = apps.filter(a => a.category !== 'system');
  const systemApps = apps.filter(a => a.category === 'system');
  const hasSystem = systemApps.length > 0;

  return (
    <TooltipProvider delayDuration={200}>
      <motion.aside
        initial={false}
        animate={{ width: leftRailCollapsed ? 48 : 200 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="h-full bg-sidebar flex flex-col border-r border-sidebar-border select-none shrink-0 overflow-hidden"
      >
        {/* Collapse toggle */}
        <div className={cn('flex items-center h-9 shrink-0', leftRailCollapsed ? 'justify-center' : 'justify-end px-2')}>
          <button
            onClick={() => setLeftRailCollapsed(!leftRailCollapsed)}
            aria-label={leftRailCollapsed ? 'Expandir navegação' : 'Colapsar navegação'}
            className="p-1 rounded text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            {leftRailCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto workspace-scroll py-1">
          <NavItems apps={coreApps} activeApp={activeApp} onOpen={openApp} collapsed={leftRailCollapsed} />

          {hasSystem && (
            <>
              <div className="px-3 my-2">
                <Separator className="bg-sidebar-border" />
              </div>
              <NavItems apps={systemApps} activeApp={activeApp} onOpen={openApp} collapsed={leftRailCollapsed} />
            </>
          )}
        </nav>
      </motion.aside>
    </TooltipProvider>
  );
}

function NavItems({ apps, activeApp, onOpen, collapsed }) {
  return (
    <div className="space-y-0.5">
      {apps.map(app => {
        const Icon = app.icon;
        const isActive = activeApp === app.id;
        return (
          <Tooltip key={app.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onOpen(app.id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'w-full flex items-center gap-3 transition-all relative',
                  collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2',
                  isActive
                    ? 'text-sidebar-primary bg-sidebar-accent'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="leftRailIndicator"
                    className="absolute left-0 top-1 bottom-1 w-[2px] bg-sidebar-primary rounded-r"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                {Icon && <Icon className={cn('shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4')} aria-hidden="true" />}
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-[13px] font-medium whitespace-nowrap overflow-hidden"
                    >
                      {app.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right"><p>{app.label}</p></TooltipContent>}
          </Tooltip>
        );
      })}
    </div>
  );
}
