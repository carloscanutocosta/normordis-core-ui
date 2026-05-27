import { useEffect } from 'react';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { useWorkspace } from './WorkspaceContext';

/**
 * Command palette activated by Ctrl+K.
 *
 * @param {Array} commands - Extra commands from the consumer:
 *   [{ id, label, description?, icon?: LucideComponent, onSelect: () => void }]
 */
export default function WorkspaceCommandPalette({ commands = [] }) {
  const { apps, commandOpen, openCommand, closeCommand, openApp } = useWorkspace();

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        commandOpen ? closeCommand() : openCommand();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandOpen, openCommand, closeCommand]);

  const handleAppSelect = (appId) => {
    openApp(appId);
    closeCommand();
  };

  const handleCommandSelect = (cmd) => {
    cmd.onSelect();
    closeCommand();
  };

  const coreApps = apps.filter(a => a.category !== 'system');
  const systemApps = apps.filter(a => a.category === 'system');

  return (
    <CommandDialog open={commandOpen} onOpenChange={(open) => open ? openCommand() : closeCommand()}>
      <CommandInput placeholder="Pesquisar apps e comandos..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        {coreApps.length > 0 && (
          <CommandGroup heading="Apps">
            {coreApps.map(app => {
              const Icon = app.icon;
              return (
                <CommandItem key={app.id} value={app.label} onSelect={() => handleAppSelect(app.id)}>
                  {Icon && <Icon className="w-4 h-4 mr-2 shrink-0 text-muted-foreground" />}
                  {app.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {systemApps.length > 0 && (
          <>
            {coreApps.length > 0 && <CommandSeparator />}
            <CommandGroup heading="Sistema">
              {systemApps.map(app => {
                const Icon = app.icon;
                return (
                  <CommandItem key={app.id} value={app.label} onSelect={() => handleAppSelect(app.id)}>
                    {Icon && <Icon className="w-4 h-4 mr-2 shrink-0 text-muted-foreground" />}
                    {app.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        )}

        {commands.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Comandos">
              {commands.map(cmd => {
                const Icon = cmd.icon;
                return (
                  <CommandItem key={cmd.id} value={cmd.label} onSelect={() => handleCommandSelect(cmd)}>
                    {Icon && <Icon className="w-4 h-4 mr-2 shrink-0 text-muted-foreground" />}
                    <span>{cmd.label}</span>
                    {cmd.description && (
                      <span className="ml-auto text-xs text-muted-foreground truncate max-w-[160px]">
                        {cmd.description}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
