import type { ReactNode, ComponentType } from 'react';
import { Sun, Moon, Contrast, Monitor, ChevronDown, Search, LogOut, Menu } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { THEMES } from '@/lib/theme';
import { useWorkspace } from './WorkspaceContext';
import type { WorkspaceNotification } from './WorkspaceContext';
import NotificationsPanel from './NotificationsPanel';

const THEME_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  light: Sun,
  dark: Moon,
  'high-contrast': Contrast,
  'high-contrast-dark': Monitor,
};

interface HeaderProps {
  logo?: ReactNode;
  appName?: string;
  user?: { name?: string; email?: string };
  onLogout?: () => void;
  /** Extra buttons rendered before the user menu. */
  actions?: ReactNode;
  notifications?: WorkspaceNotification[];
  onNotificationRead?: (id: string) => void;
  onNotificationsReadAll?: () => void;
  onNotificationClear?: (id?: string) => void;
}

export default function Header({
  logo,
  appName = 'Workspace',
  user,
  onLogout,
  actions,
  notifications,
  onNotificationRead,
  onNotificationsReadAll,
  onNotificationClear,
}: HeaderProps) {
  const { theme, changeTheme, openCommand, openMobileRail } = useWorkspace();
  const ThemeIcon = THEME_ICONS[theme] ?? Sun;

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="h-11 bg-sidebar text-sidebar-foreground flex items-center justify-between px-3 select-none shrink-0 z-50 border-b border-sidebar-border">
      {/* Left: Hamburger (mobile) + Logo */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 md:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={openMobileRail}
          aria-label="Abrir navegação"
        >
          <Menu className="w-4 h-4" />
        </Button>
        {logo ?? (
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold font-mono">W</span>
          </div>
        )}
        <span className="text-sm font-semibold tracking-tight hidden sm:block">{appName}</span>
      </div>

      {/* Center: Search → opens command palette */}
      <div className="flex-1 max-w-md mx-2 sm:mx-4">
        <button
          onClick={openCommand}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md bg-sidebar-accent/50 text-sidebar-foreground/60 text-xs hover:bg-sidebar-accent transition-colors"
          aria-label="Abrir paleta de comandos"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Pesquisar apps e comandos...</span>
          <kbd className="ml-auto text-[10px] bg-sidebar-accent px-1.5 py-0.5 rounded font-mono hidden sm:inline">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <TooltipProvider delayDuration={300}>
          {actions}

          <NotificationsPanel
            notifications={notifications}
            onNotificationRead={onNotificationRead}
            onNotificationsReadAll={onNotificationsReadAll}
            onNotificationClear={onNotificationClear}
          />

          {/* Theme selector */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Selecionar tema" className="h-7 w-7 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                    <ThemeIcon className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Tema</p></TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="min-w-[190px]">
              {THEMES.map(({ id, label }) => {
                const Icon = THEME_ICONS[id];
                return (
                  <DropdownMenuItem
                    key={id}
                    onClick={() => changeTheme(id)}
                    className={theme === id ? 'bg-accent text-accent-foreground' : ''}
                  >
                    {Icon && <Icon className="w-4 h-4 mr-2 shrink-0" />}
                    {label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          {(user || onLogout) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-7 gap-1.5 px-1.5 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[180px]">
                {user && (
                  <div className="px-2 py-1.5 border-b mb-1">
                    <p className="text-sm font-medium">{user.name || 'Utilizador'}</p>
                    {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
                  </div>
                )}
                {onLogout && (
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Terminar Sessão
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </TooltipProvider>
      </div>
    </header>
  );
}
