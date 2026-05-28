import { useState, useEffect } from 'react';
import { Wifi, WifiOff, User, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkspace } from './WorkspaceContext';
import type { IconComponent } from './WorkspaceContext';
import AtendimentoPanel from './AtendimentoPanel';
import type { AtendimentoData } from './AtendimentoPanel';

function useClock(locale: string) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const timeStr = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString(locale, { weekday: 'short', day: '2-digit', month: 'short' });
  return { timeStr, dateStr };
}

function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on  = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online',  on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return online;
}

interface StatusBarProps {
  user?: { name?: string; email?: string };
  locale?: string;
  showAtendimento?: boolean;
  onAtendimentoSave?: (data: AtendimentoData) => Promise<void>;
  areas?: string[];
  canais?: Array<{ label: string; icon: IconComponent }>;
  prioridades?: Array<{ label: string; color: string }>;
  estados?: string[];
}

export default function StatusBar({
  user,
  locale = 'pt-PT',
  showAtendimento = true,
  onAtendimentoSave,
  areas,
  canais,
  prioridades,
  estados,
}: StatusBarProps) {
  const online = useOnline();
  const { timeStr, dateStr } = useClock(locale);
  const [panelOpen, setPanelOpen] = useState(false);
  const { atendimento } = useWorkspace();
  const sessionActive = atendimento.started && !panelOpen;

  return (
    <>
      <footer className="h-7 bg-primary flex items-center justify-between px-3 select-none shrink-0 text-primary-foreground text-[11px] font-mono">
        {/* Left: connection + user */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            {online
              ? <Wifi className="w-3 h-3" aria-hidden="true" />
              : <WifiOff className="w-3 h-3 text-red-300" aria-hidden="true" />}
            <span className={online ? '' : 'text-red-300'}>{online ? 'Online' : 'Offline'}</span>
          </div>

          {user && (
            <>
              <span className="text-primary-foreground/30" aria-hidden="true">·</span>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 opacity-70" aria-hidden="true" />
                <span className="truncate max-w-[160px]">{user.name || user.email || '—'}</span>
              </div>
            </>
          )}
        </div>

        {/* Center: clock */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-2 pointer-events-none" aria-live="off">
          <span className="font-mono font-medium tabular-nums">{timeStr}</span>
          <span className="opacity-60 capitalize hidden md:inline">{dateStr}</span>
        </div>

        {/* Right: Registar Atendimento */}
        {showAtendimento && (
          <button
            onClick={() => setPanelOpen(true)}
            className={cn(
              'relative flex items-center gap-1.5 px-2.5 py-0.5 rounded transition-colors font-sans font-medium text-[11px] shrink-0',
              sessionActive
                ? 'bg-primary-foreground/30 hover:bg-primary-foreground/40'
                : 'bg-primary-foreground/15 hover:bg-primary-foreground/25',
            )}
          >
            {sessionActive && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
            )}
            <ClipboardList className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">
              {sessionActive ? 'Atendimento em curso' : 'Registar Atendimento'}
            </span>
          </button>
        )}
      </footer>

      {showAtendimento && (
        <AtendimentoPanel
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
          onSave={onAtendimentoSave}
          locale={locale}
          areas={areas}
          canais={canais}
          prioridades={prioridades}
          estados={estados}
        />
      )}
    </>
  );
}
