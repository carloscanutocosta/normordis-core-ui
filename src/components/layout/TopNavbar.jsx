import React, { useState } from 'react';
import { Menu, X, ChevronDown, Search, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Início', href: '#' },
  { label: 'Produtos', href: '#', children: ['Web App', 'Mobile', 'API', 'Integrações'] },
  { label: 'Preços', href: '#' },
  {
    label: 'Documentação',
    href: '#',
    children: ['Guia de início', 'Referência API', 'Exemplos', 'Changelog'],
  },
  { label: 'Empresa', href: '#' },
];

export default function TopNavbar({ className }) {
  const [mobile, setMobile] = useState(false);
  const [dropdown, setDropdown] = useState(null);

  return (
    <div className={cn('rounded-xl overflow-hidden border border-border', className)}>
      <nav className="bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">A</span>
            </div>
            <span className="font-semibold text-sm text-foreground">AppName</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setDropdown(link.label)}
                onMouseLeave={() => setDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-foreground hover:text-primary rounded-md hover:bg-muted transition-colors">
                  {link.label}
                  {link.children && (
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform',
                        dropdown === link.label && 'rotate-180',
                      )}
                    />
                  )}
                </button>
                {link.children && dropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg p-1 w-44 z-20">
                    {link.children.map((c) => (
                      <button
                        key={c}
                        className="w-full text-left px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-muted transition-colors hidden md:flex">
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors hidden md:flex">
              <Bell className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <button className="md:hidden p-2" onClick={() => setMobile((o) => !o)}>
              {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobile && (
          <div className="md:hidden border-t border-border p-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>
      <div className="bg-background p-6 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Conteúdo da página</p>
      </div>
    </div>
  );
}
