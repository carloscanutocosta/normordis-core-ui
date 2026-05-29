import { BarChart2, Home, Settings, Users } from 'lucide-react';
import SidebarLayout from './SidebarLayout';

export default {
  title: 'Layout/SidebarLayout',
  component: SidebarLayout,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'analytics', label: 'Análises', icon: BarChart2 },
  { id: 'users', label: 'Utilizadores', icon: Users },
  { id: 'settings', label: 'Definições', icon: Settings },
];

export const Default = {
  args: {
    navItems: NAV,
    user: { name: 'Ana Costa', email: 'ana@empresa.pt', initials: 'AC' },
    logo: { initials: 'N', name: 'Normordis' },
    onNavChange: () => {},
    onLogout: () => {},
  },
};

export const WithContent = {
  args: {
    ...Default.args,
    children: (
      <div className="p-6">
        <h3 className="font-semibold text-foreground mb-2">Conteúdo da página</h3>
        <p className="text-sm text-muted-foreground">
          O conteúdo principal é renderizado aqui via prop children.
        </p>
      </div>
    ),
  },
};

export const NoUser = {
  args: {
    navItems: NAV,
    user: null,
    logo: { initials: 'N', name: 'Normordis' },
    onNavChange: () => {},
    onLogout: () => {},
  },
};

export const ActiveItem = {
  args: {
    ...Default.args,
    activeItem: 'analytics',
  },
};
