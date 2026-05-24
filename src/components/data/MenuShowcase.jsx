import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MoreVertical, MoreHorizontal, ChevronDown,
  User, Settings, LogOut, Trash2, Edit, Copy, Share2,
  Bell, HelpCircle, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

// ── Hamburger Menu ─────────────────────────────────────────────────────────
function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const navItems = ["Início", "Sobre", "Serviços", "Portfólio", "Contacto"];

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
        className={cn(
          "flex flex-col justify-center gap-[5px] p-2 rounded-md transition-colors",
          open ? "bg-primary/10" : "hover:bg-muted"
        )}
      >
        <span className={cn("block h-0.5 w-5 bg-foreground rounded transition-transform origin-center", open && "rotate-45 translate-y-[7px]")} />
        <span className={cn("block h-0.5 w-5 bg-foreground rounded transition-opacity", open && "opacity-0")} />
        <span className={cn("block h-0.5 w-5 bg-foreground rounded transition-transform origin-center", open && "-rotate-45 -translate-y-[7px]")} />
      </button>
      {open && (
        <div className="absolute z-50 mt-2 top-full left-0 w-48 rounded-md border border-border bg-popover shadow-lg p-1">
          {navItems.map((item) => (
            <button key={item} type="button" onClick={() => setOpen(false)}
              className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted text-foreground transition-colors">
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Kebab Menu (vertical dots) ─────────────────────────────────────────────
function KebabMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
        <DropdownMenuItem><Copy className="h-4 w-4 mr-2" />Duplicar</DropdownMenuItem>
        <DropdownMenuItem><Share2 className="h-4 w-4 mr-2" />Partilhar</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── Meatball Menu (horizontal dots) ───────────────────────────────────────
function MeatballMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
        <DropdownMenuItem><Copy className="h-4 w-4 mr-2" />Duplicar</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── Dropdown Menu (with label + submenu) ────────────────────────────────────
function DropdownWithSubmenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-1.5">
          Conta <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>A minha conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem><User className="h-4 w-4 mr-2" />Perfil</DropdownMenuItem>
        <DropdownMenuItem><Bell className="h-4 w-4 mr-2" />Notificações</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger><Settings className="h-4 w-4 mr-2" />Definições</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Aparência</DropdownMenuItem>
            <DropdownMenuItem>Privacidade</DropdownMenuItem>
            <DropdownMenuItem>Segurança</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem><HelpCircle className="h-4 w-4 mr-2" />Ajuda</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <LogOut className="h-4 w-4 mr-2" />Terminar sessão
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── FAB Speed Dial ─────────────────────────────────────────────────────────
function SpeedDial() {
  const [open, setOpen] = useState(false);
  const actions = [
    { label: "Novo documento", icon: Plus },
    { label: "Partilhar", icon: Share2 },
    { label: "Editar", icon: Edit },
  ];

  return (
    <div className="relative inline-flex flex-col items-center gap-2">
      {open && (
        <div className="flex flex-col items-center gap-2">
          {actions.map(({ label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs bg-popover border border-border rounded px-2 py-0.5 shadow text-foreground whitespace-nowrap">{label}</span>
              <button type="button" onClick={() => setOpen(false)}
                className="h-9 w-9 rounded-full bg-secondary border border-border flex items-center justify-center shadow hover:bg-muted transition-colors">
                <Icon className="h-4 w-4 text-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-all",
          open ? "bg-destructive text-destructive-foreground rotate-45" : "bg-primary text-primary-foreground"
        )}
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}

// ── Context Menu hint ──────────────────────────────────────────────────────
function ContextMenuDemo() {
  const [pos, setPos] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const close = () => setPos(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const items = [
    { label: "Copiar", icon: Copy },
    { label: "Editar", icon: Edit },
    { label: "Partilhar", icon: Share2 },
    null,
    { label: "Eliminar", icon: Trash2, danger: true },
  ];

  return (
    <div ref={ref} onContextMenu={handleContextMenu} className="relative select-none">
      <div className="border-2 border-dashed border-border rounded-lg px-6 py-4 text-sm text-muted-foreground text-center cursor-context-menu">
        Clique com o botão direito aqui
      </div>
      {pos && (
        <div
          className="absolute z-50 min-w-[160px] rounded-md border border-border bg-popover shadow-lg p-1"
          style={{ left: pos.x, top: pos.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, i) =>
            item === null ? (
              <div key={i} className="my-1 h-px bg-border" />
            ) : (
              <button key={item.label} type="button" onClick={() => setPos(null)}
                className={cn("w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors",
                  item.danger ? "text-destructive hover:bg-destructive/10" : "text-foreground hover:bg-muted"
                )}>
                <item.icon className="h-4 w-4" />{item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ── Exports ────────────────────────────────────────────────────────────────
export { HamburgerMenu, KebabMenu, MeatballMenu, DropdownWithSubmenu, SpeedDial, ContextMenuDemo };