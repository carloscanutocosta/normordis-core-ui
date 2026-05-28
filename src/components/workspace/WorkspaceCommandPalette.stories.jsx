import { useEffect } from 'react';
import { LayoutDashboard, FileText, Users, Settings, Plus, Download, Filter } from 'lucide-react';
import { WorkspaceProvider, useWorkspace } from './WorkspaceContext';
import WorkspaceCommandPalette from './WorkspaceCommandPalette';

const APPS = [
  { id: 'dashboard', label: 'Dashboard',     icon: LayoutDashboard, category: 'core'   },
  { id: 'documents', label: 'Documentos',    icon: FileText,        category: 'core'   },
  { id: 'users',     label: 'Utilizadores',  icon: Users,           category: 'core'   },
  { id: 'settings',  label: 'Definições',    icon: Settings,        category: 'system' },
];

const STATIC_COMMANDS = [
  { id: 'new-process',  label: 'Novo processo',    icon: Plus,     description: 'Abre formulário de criação', onSelect: () => {} },
  { id: 'export',       label: 'Exportar dados',   icon: Download, description: 'Exporta a vista actual',     onSelect: () => {} },
  { id: 'filter',       label: 'Filtrar resultados', icon: Filter,  description: 'Abre painel de filtros',    onSelect: () => {} },
];

// Opens the command palette right after mounting
function PaletteOpener() {
  const { openCommand } = useWorkspace();
  useEffect(() => { openCommand(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

// Registers dynamic commands for the active app
function AppCommandRegistrar({ commands }) {
  const { activeApp, registerCommands } = useWorkspace();
  useEffect(() => {
    if (activeApp) return registerCommands(activeApp, commands);
  }, [activeApp]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export default {
  title: 'Workspace/WorkspaceCommandPalette',
  component: WorkspaceCommandPalette,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    // The palette renders as a dialog — a full-screen canvas makes it look right
  },
};

export const AppsOnly = {
  name: 'Apps only',
  render: () => (
    <WorkspaceProvider apps={APPS}>
      <PaletteOpener />
      <WorkspaceCommandPalette />
    </WorkspaceProvider>
  ),
};

export const WithStaticCommands = {
  name: 'With static consumer commands',
  render: () => (
    <WorkspaceProvider apps={APPS}>
      <PaletteOpener />
      <WorkspaceCommandPalette commands={STATIC_COMMANDS} />
    </WorkspaceProvider>
  ),
};

export const WithDynamicAppCommands = {
  name: 'With dynamic app commands',
  render: () => (
    <WorkspaceProvider apps={APPS}>
      <AppCommandRegistrar commands={[
        { id: 'new-doc',    label: 'Novo documento',    icon: Plus,     onSelect: () => {}, description: 'Cria um documento em branco' },
        { id: 'export-pdf', label: 'Exportar PDF',      icon: Download, onSelect: () => {}, description: 'Exporta a selecção para PDF'  },
      ]} />
      <PaletteOpener />
      <WorkspaceCommandPalette commands={STATIC_COMMANDS} />
    </WorkspaceProvider>
  ),
};
