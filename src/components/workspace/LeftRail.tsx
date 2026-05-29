import { X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspace } from './WorkspaceContext';
import type { AppDefinition } from './WorkspaceContext';
import { useIsMobile } from '@/hooks/use-mobile';

export default function LeftRail() {
  const {
    apps,
    activeApp,
    openApp,
    leftRailCollapsed,
    setLeftRailCollapsed,
    mobileRailOpen,
    closeMobileRail,
    appBadges,
  } = useWorkspace();
  const isMobile = useIsMobile();

  const coreApps = apps.filter((a) => a.category !== 'system');
  const systemApps = apps.filter((a) => a.category === 'system');
  const hasSystem = systemApps.length > 0;

  const handleAppOpen = (appId: string) => {
    openApp(appId);
    if (isMobile) closeMobileRail();
  };

  if (isMobile) {
    return (
      <AnimatePresence>
        {mobileRailOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
              onClick={closeMobileRail}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -200 }}
              animate={{ x: 0 }}
              exit={{ x: -200 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="fixed left-0 top-0 bottom-0 w-[200px] z-50 bg-sidebar flex flex-col border-r border-sidebar-border select-none"
            >
              <div className="flex items-center justify-between h-11 px-3 border-b border-sidebar-border shrink-0">
                <span className="text-sm font-semibold text-sidebar-foreground">Apps</span>
                <button
                  onClick={closeMobileRail}
                  aria-label="Fechar navegação"
                  className="p-1 rounded text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav
                aria-label="Navegação principal"
                className="flex-1 overflow-y-auto workspace-scroll py-1"
              >
                <NavItems
                  apps={coreApps}
                  activeApp={activeApp}
                  onOpen={handleAppOpen}
                  collapsed={false}
                  badges={appBadges}
                />
                {hasSystem && (
                  <>
                    <div className="px-3 my-2">
                      <Separator className="bg-sidebar-border" />
                    </div>
                    <NavItems
                      apps={systemApps}
                      activeApp={activeApp}
                      onOpen={handleAppOpen}
                      collapsed={false}
                      badges={appBadges}
                    />
                  </>
                )}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <motion.aside
        initial={false}
        animate={{ width: leftRailCollapsed ? 48 : 200 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="h-full bg-sidebar flex flex-col border-r border-sidebar-border select-none shrink-0 overflow-hidden"
      >
        <div
          className={cn(
            'flex items-center h-9 shrink-0',
            leftRailCollapsed ? 'justify-center' : 'justify-end px-2',
          )}
        >
          <button
            onClick={() => setLeftRailCollapsed(!leftRailCollapsed)}
            aria-label={leftRailCollapsed ? 'Expandir navegação' : 'Colapsar navegação'}
            className="p-1 rounded text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            {leftRailCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav
          aria-label="Navegação principal"
          className="flex-1 overflow-y-auto workspace-scroll py-1"
        >
          <NavItems
            apps={coreApps}
            activeApp={activeApp}
            onOpen={openApp}
            collapsed={leftRailCollapsed}
            badges={appBadges}
          />
          {hasSystem && (
            <>
              <div className="px-3 my-2">
                <Separator className="bg-sidebar-border" />
              </div>
              <NavItems
                apps={systemApps}
                activeApp={activeApp}
                onOpen={openApp}
                collapsed={leftRailCollapsed}
                badges={appBadges}
              />
            </>
          )}
        </nav>
      </motion.aside>
    </TooltipProvider>
  );
}

interface NavItemsProps {
  apps: AppDefinition[];
  activeApp: string | null;
  onOpen: (appId: string) => void;
  collapsed: boolean;
  badges: Record<string, number>;
}

function NavItems({ apps, activeApp, onOpen, collapsed, badges }: NavItemsProps) {
  return (
    <div className="space-y-0.5">
      {apps.map((app) => {
        const Icon = app.icon;
        const isActive = activeApp === app.id;
        const badge = badges[app.id] ?? 0;

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
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent',
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="leftRailIndicator"
                    className="absolute left-0 top-1 bottom-1 w-[2px] bg-sidebar-primary rounded-r"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}

                <span className="relative shrink-0">
                  {Icon && (
                    <Icon className={cn(collapsed ? 'w-5 h-5' : 'w-4 h-4')} aria-hidden="true" />
                  )}
                  {badge > 0 && collapsed && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center px-0.5 leading-none">
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                </span>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-[13px] font-medium whitespace-nowrap overflow-hidden flex-1 text-left"
                    >
                      {app.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {!collapsed && badge > 0 && (
                  <span className="ml-auto min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center px-1 shrink-0">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                <p>
                  {app.label}
                  {badge > 0 ? ` (${badge})` : ''}
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        );
      })}
    </div>
  );
}
