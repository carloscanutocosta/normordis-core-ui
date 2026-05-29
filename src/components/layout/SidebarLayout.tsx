import React, { useState, ComponentType, ReactNode } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart2,
  Users,
  Settings,
  FileText,
  Bell,
  LogOut,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'analytics', label: 'Análises', icon: BarChart2 },
  { id: 'users', label: 'Utilizadores', icon: Users },
  { id: 'reports', label: 'Relatórios', icon: FileText },
  { id: 'notifs', label: 'Notificações', icon: Bell },
  { id: 'settings', label: 'Definições', icon: Settings },
];

const DEFAULT_USER = { name: 'João Costa', email: 'joao@empresa.pt', initials: 'JC' };
const DEFAULT_LOGO = { initials: 'A', name: 'App' };

interface NavItem {
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
}

interface SidebarUser {
  name: string;
  email?: string;
  initials?: string;
}

interface SidebarLogo {
  initials?: string;
  name?: string;
}

interface SidebarLayoutProps {
  navItems?: NavItem[];
  user?: SidebarUser | null;
  logo?: SidebarLogo;
  activeItem?: string;
  onNavChange?: (id: string) => void;
  onLogout?: () => void;
  children?: ReactNode;
  className?: string;
}

export default function SidebarLayout({
  navItems = DEFAULT_NAV_ITEMS,
  user = DEFAULT_USER,
  logo = DEFAULT_LOGO,
  activeItem: activeItemProp,
  onNavChange,
  onLogout,
  children,
  className,
}: SidebarLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeInternal, setActiveInternal] = useState(navItems[0]?.id ?? '');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Support both controlled (activeItemProp) and uncontrolled usage
  const activeId = activeItemProp ?? activeInternal;

  const handleNavClick = (id) => {
    if (!activeItemProp) setActiveInternal(id);
    onNavChange?.(id);
    setMobileOpen(false);
  };

  const activeNav = navItems.find((i) => i.id === activeId);

  const Sidebar = ({ mobile = false }) => (
    <aside
      className={cn(
        'bg-card border-r border-border flex flex-col transition-all duration-300',
        mobile ? 'w-64 fixed inset-y-0 left-0 z-50 shadow-2xl' : collapsed ? 'w-16' : 'w-56',
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        {logo.initials && (
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary-foreground">{logo.initials}</span>
          </div>
        )}
        {(!collapsed || mobile) && logo.name && (
          <span className="font-semibold text-sm text-foreground">{logo.name}</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleNavClick(id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              activeId === id
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-foreground hover:bg-muted',
            )}
            title={collapsed && !mobile ? label : undefined}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" />}
            {(!collapsed || mobile) && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-border space-y-0.5">
        {user && (!collapsed || mobile) && (
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-primary">
                {user.initials ?? user.name?.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{user.name}</p>
              {user.email && (
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              )}
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {(!collapsed || mobile) && <span>Sair</span>}
        </button>
      </div>

      {/* Collapse toggle (desktop only) */}
      {!mobile && (
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute top-4 -right-3 h-6 w-6 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:bg-muted transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </aside>
  );

  return (
    <div
      className={cn(
        'flex h-[420px] rounded-xl overflow-hidden border border-border relative',
        className,
      )}
    >
      {/* Desktop sidebar */}
      <div className="hidden md:flex relative">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <Sidebar mobile />
        </>
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background">
        <header className="flex items-center gap-3 px-5 py-3.5 border-b border-border">
          <button className="md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          {activeNav && <h2 className="font-semibold text-foreground">{activeNav.label}</h2>}
        </header>
        <div className="flex-1 overflow-auto">
          {children ?? (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                {activeNav ? (
                  <>
                    Conteúdo de <strong>{activeNav.label}</strong>
                  </>
                ) : null}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
