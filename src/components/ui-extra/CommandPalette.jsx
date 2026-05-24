import React, { useState, useEffect } from "react";
import { Search, FileText, Users, Settings, BarChart2, Home, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const COMMANDS = [
  { id:1, label:"Dashboard",          group:"Navegação",   icon:Home,      shortcut:"G D" },
  { id:2, label:"Utilizadores",       group:"Navegação",   icon:Users,     shortcut:"G U" },
  { id:3, label:"Relatórios",         group:"Navegação",   icon:BarChart2, shortcut:"G R" },
  { id:4, label:"Definições",         group:"Navegação",   icon:Settings,  shortcut:"G S" },
  { id:5, label:"Novo documento",     group:"Acções",      icon:FileText,  shortcut:"N D" },
  { id:6, label:"Convidar utilizador",group:"Acções",      icon:Users,     shortcut:"N U" },
  { id:7, label:"Exportar dados",     group:"Acções",      icon:BarChart2, shortcut:"E X" },
];

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const filtered = query
    ? COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS;

  const grouped = filtered.reduce((acc, cmd) => {
    (acc[cmd.group] = acc[cmd.group] || []).push(cmd);
    return acc;
  }, {});

  useEffect(() => { setActiveIdx(0); }, [query]);

  useEffect(() => {
    if (!open) { setQuery(""); setActiveIdx(0); }
  }, [open]);

  const handleKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i+1, filtered.length-1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx((i) => Math.max(i-1, 0)); }
    if (e.key === "Escape") onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Pesquisar acções, páginas..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {Object.entries(grouped).map(([group, cmds]) => (
            <div key={group}>
              <div className="px-4 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{group}</div>
              {cmds.map((cmd, i) => {
                const globalIdx = filtered.indexOf(cmd);
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={onClose}
                    className={cn("w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors", globalIdx === activeIdx ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/40")}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left">{cmd.label}</span>
                    {cmd.shortcut && <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">{cmd.shortcut}</kbd>}
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && <p className="px-4 py-6 text-center text-sm text-muted-foreground">Nenhum resultado para "{query}"</p>}
        </div>
      </div>
    </div>
  );
}