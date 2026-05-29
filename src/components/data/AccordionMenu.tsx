import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  Home,
  BarChart2,
  Users,
  Settings,
  FileText,
  Shield,
  Bell,
  HelpCircle,
} from 'lucide-react';

const MENU_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
  },
  {
    id: 'analytics',
    label: 'Análises',
    icon: BarChart2,
    children: [
      { id: 'analytics-overview', label: 'Visão geral' },
      { id: 'analytics-reports', label: 'Relatórios' },
      { id: 'analytics-exports', label: 'Exportações' },
    ],
  },
  {
    id: 'users',
    label: 'Utilizadores',
    icon: Users,
    children: [
      { id: 'users-list', label: 'Lista' },
      { id: 'users-groups', label: 'Grupos' },
      { id: 'users-invites', label: 'Convites' },
    ],
  },
  {
    id: 'content',
    label: 'Conteúdo',
    icon: FileText,
    children: [
      { id: 'content-pages', label: 'Páginas' },
      { id: 'content-articles', label: 'Artigos' },
      { id: 'content-media', label: 'Media' },
    ],
  },
  {
    id: 'settings',
    label: 'Definições',
    icon: Settings,
    children: [
      { id: 'settings-general', label: 'Geral' },
      { id: 'settings-security', label: 'Segurança', icon: Shield },
      { id: 'settings-notifs', label: 'Notificações', icon: Bell },
    ],
  },
  {
    id: 'help',
    label: 'Ajuda',
    icon: HelpCircle,
  },
];

function MenuItem({ item, depth = 0, activeId, onSelect, openId, onToggle }) {
  const hasChildren = item.children?.length > 0;
  const open = openId === item.id;
  const Icon = item.icon;
  const isActive = activeId === item.id;

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (hasChildren) onToggle(open ? null : item.id);
          else onSelect(item.id);
        }}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
          depth > 0 ? 'pl-8' : '',
          isActive ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted',
        )}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0" />}
        <span className="flex-1 text-left">{item.label}</span>
        {hasChildren && (
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 text-muted-foreground transition-transform',
              open && 'rotate-180',
            )}
          />
        )}
      </button>
      {hasChildren && open && (
        <div className="mt-0.5 space-y-0.5 border-l border-border ml-5 pl-1">
          {item.children.map((child) => (
            <MenuItem
              key={child.id}
              item={child}
              depth={depth + 1}
              activeId={activeId}
              onSelect={onSelect}
              openId={openId}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface AccordionMenuProps {
  className?: string;
}

export default function AccordionMenu({ className }: AccordionMenuProps) {
  const [activeId, setActiveId] = useState('dashboard');
  const [openId, setOpenId] = useState(null);

  return (
    <nav className={cn('w-full space-y-0.5', className)}>
      {MENU_ITEMS.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          activeId={activeId}
          onSelect={setActiveId}
          openId={openId}
          onToggle={setOpenId}
        />
      ))}
    </nav>
  );
}
