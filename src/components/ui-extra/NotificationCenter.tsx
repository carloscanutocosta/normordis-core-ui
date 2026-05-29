import React, { useState } from 'react';
import { Bell, CheckCheck, X, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SAMPLE = [
  {
    id: 1,
    type: 'info',
    title: 'Nova actualização disponível',
    body: 'v2.4.0 inclui melhorias de desempenho.',
    time: '2 min',
    read: false,
  },
  {
    id: 2,
    type: 'success',
    title: 'Exportação concluída',
    body: 'O relatório mensal foi gerado com sucesso.',
    time: '15 min',
    read: false,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Período de avaliação',
    body: 'Termina em 3 dias. Considere renovar.',
    time: '1h',
    read: false,
  },
  {
    id: 4,
    type: 'error',
    title: 'Falha na sincronização',
    body: 'Não foi possível ligar ao servidor.',
    time: '3h',
    read: true,
  },
  {
    id: 5,
    type: 'info',
    title: 'João Costa convidado',
    body: 'O convite foi enviado com sucesso.',
    time: '1d',
    read: true,
  },
];

const ICONS = { info: Info, success: CheckCircle2, warning: AlertTriangle, error: AlertCircle };
const COLORS = {
  info: 'text-primary bg-primary/10',
  success: 'text-green-600 bg-green-50',
  warning: 'text-amber-600 bg-amber-50',
  error: 'text-destructive bg-destructive/10',
};

interface NotificationCenterProps {
  className?: string;
}

export default function NotificationCenter({ className }: NotificationCenterProps) {
  const [notifs, setNotifs] = useState(SAMPLE);
  const [open, setOpen] = useState(false);

  const unread = notifs.filter((n) => !n.read).length;
  const markAll = () => setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
  const dismiss = (id) => setNotifs((ns) => ns.filter((n) => n.id !== id));
  const markOne = (id) =>
    setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div className={cn('relative inline-block', className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors"
      >
        <Bell className="h-5 w-5 text-foreground" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-40 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="font-semibold text-sm text-foreground">
                Notificações {unread > 0 && <span className="text-primary">({unread})</span>}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-muted-foreground gap-1"
                onClick={markAll}
              >
                <CheckCheck className="h-3.5 w-3.5" /> Marcar todas
              </Button>
            </div>
            <div className="max-h-96 overflow-y-auto divide-y divide-border">
              {notifs.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">Sem notificações</p>
              )}
              {notifs.map((n) => {
                const Icon = ICONS[n.type];
                return (
                  <div
                    key={n.id}
                    onClick={() => markOne(n.id)}
                    className={cn(
                      'flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/30',
                      !n.read && 'bg-primary/3',
                    )}
                  >
                    <div
                      className={cn(
                        'h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                        COLORS[n.type],
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm font-medium text-foreground truncate',
                          !n.read && 'font-semibold',
                        )}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{n.body}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismiss(n.id);
                      }}
                      className="text-muted-foreground hover:text-foreground mt-0.5"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
