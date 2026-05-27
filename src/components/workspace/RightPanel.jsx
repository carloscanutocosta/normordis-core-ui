import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useWorkspace } from './WorkspaceContext';

/**
 * @param {Object} panels - { [toolId]: { title: string, icon: LucideComponent, content: ReactNode } }
 */
export default function RightPanel({ panels = {} }) {
  const { activeTool, rightPanelOpen, toggleTool } = useWorkspace();
  const panel = activeTool ? panels[activeTool] : null;

  return (
    <AnimatePresence>
      {rightPanelOpen && panel && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 260, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="h-full bg-card border-l border-border overflow-hidden shrink-0"
        >
          <div className="w-[260px] h-full flex flex-col">
            <div className="flex items-center justify-between px-3 h-9 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                {panel.icon && <panel.icon className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />}
                <span className="text-xs font-semibold">{panel.title}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => toggleTool(activeTool)}
                aria-label="Fechar painel"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto workspace-scroll">
              {panel.content}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
