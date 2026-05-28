import { Bell, BellOff, Check, CheckCheck, Trash2, Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useWorkspace } from './WorkspaceContext';
import type { WorkspaceNotification } from './WorkspaceContext';

export interface NotificationsPanelProps {
  notifications?: WorkspaceNotification[];
  onNotificationRead?: (id: string) => void;
  onNotificationsReadAll?: () => void;
  onNotificationClear?: (id?: string) => void;
}

const TYPE_ICONS = {
  info:    { icon: Info,          className: 'text-blue-500' },
  success: { icon: CheckCircle2,  className: 'text-emerald-500' },
  warning: { icon: AlertTriangle, className: 'text-amber-500' },
  error:   { icon: XCircle,       className: 'text-destructive' },
} as const;

export default function NotificationsPanel({
  notifications = [],
  onNotificationRead,
  onNotificationsReadAll,
  onNotificationClear,
}: NotificationsPanelProps) {
  const {
    internalNotifications,
    readInternalNotification,
    clearInternalNotification,
    readAllInternalNotifications,
  } = useWorkspace();

  const all          = [...internalNotifications, ...notifications];
  const unreadCount  = all.filter(n => !n.read).length;
  const isInternal   = (id: string) => internalNotifications.some(n => n.id === id);

  const handleRead = (id: string) => {
    if (isInternal(id)) readInternalNotification(id);
    else onNotificationRead?.(id);
  };

  const handleClear = (id?: string) => {
    if (id === undefined) {
      clearInternalNotification();
      onNotificationClear?.();
    } else if (isInternal(id)) {
      clearInternalNotification(id);
    } else {
      onNotificationClear?.(id);
    }
  };

  const handleReadAll = () => {
    readAllInternalNotifications();
    onNotificationsReadAll?.();
  };

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-7 w-7 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              aria-label={`Notificações${unreadCount ? ` (${unreadCount} não lidas)` : ''}`}
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center px-0.5 leading-none">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom"><p>Notificações</p></TooltipContent>
      </Tooltip>

      <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm font-semibold">Notificações</span>
            {unreadCount > 0 && (
              <span className="text-xs text-muted-foreground">({unreadCount} não lidas)</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleReadAll} aria-label="Marcar todas como lidas">
                    <CheckCheck className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Marcar todas como lidas</p></TooltipContent>
              </Tooltip>
            )}
            {all.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleClear(undefined)} aria-label="Limpar todas">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Limpar todas</p></TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {all.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <BellOff className="w-8 h-8 opacity-30" />
            <p className="text-xs">Sem notificações</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[360px]">
            <div className="divide-y divide-border">
              {all.map((n) => {
                const typeConfig = TYPE_ICONS[n.type as keyof typeof TYPE_ICONS] ?? TYPE_ICONS.info;
                const TypeIcon   = typeConfig.icon;
                return (
                  <div
                    key={n.id}
                    className={cn(
                      'flex items-start gap-3 px-3 py-3 transition-colors',
                      !n.read ? 'bg-muted/40' : 'hover:bg-muted/20'
                    )}
                  >
                    <TypeIcon className={cn('w-4 h-4 mt-0.5 shrink-0', typeConfig.className)} aria-hidden="true" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn('text-xs leading-snug', !n.read && 'font-semibold')}>{n.title}</p>
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1" aria-label="Não lida" />
                        )}
                      </div>
                      {n.description && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{n.description}</p>
                      )}
                      {n.time && (
                        <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 shrink-0">
                      {!n.read && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleRead(n.id)} aria-label="Marcar como lida">
                              <Check className="w-3 h-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left"><p>Marcar como lida</p></TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-destructive" onClick={() => handleClear(n.id)} aria-label="Remover">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left"><p>Remover</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
