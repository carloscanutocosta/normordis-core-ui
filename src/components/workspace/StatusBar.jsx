import { useState, useEffect } from 'react';
import { Wifi, WifiOff, User, ClipboardList } from 'lucide-react';
import { useWorkspace } from './WorkspaceContext';
import AtendimentoPanel from './AtendimentoPanel';

function useClock(locale) {
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
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return online;
}

/**
 * @param {{ name?: string, email?: string }} user
 * @param {string}   locale            - date/time locale (default 'pt-PT')
 * @param {boolean}  showAtendimento   - show/hide "Registar Atendimento" button (default true)
 * @param {(data: object) => Promise<void>} onAtendimentoSave
 */
export default function StatusBar({ user, locale = 'pt-PT', showAtendimento = true, onAtendimentoSave, areas, canais, prioridades, estados }) {
  const online = useOnline();
  const { timeStr, dateStr } = useClock(locale);
  const [panelOpen, setPanelOpen] = useState(false);

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
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none" aria-live="off">
          <span className="font-mono font-medium tabular-nums">{timeStr}</span>
          <span className="opacity-60 capitalize hidden sm:inline">{dateStr}</span>
        </div>

        {/* Right: Registar Atendimento */}
        {showAtendimento && (
          <button
            onClick={() => setPanelOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-primary-foreground/15 hover:bg-primary-foreground/25 transition-colors font-sans font-medium text-[11px] shrink-0"
          >
            <ClipboardList className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Registar Atendimento</span>
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
