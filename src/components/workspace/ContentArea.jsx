import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useWorkspace } from './WorkspaceContext';
import TabBar from './TabBar';

class AppErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <div>
          <p className="text-sm font-semibold">Erro ao carregar a app</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            {this.state.error?.message ?? 'Ocorreu um erro inesperado.'}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => this.setState({ error: null })}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Tentar novamente
        </Button>
      </div>
    );
  }
}

export default function ContentArea({ children }) {
  const { activeApp } = useWorkspace();
  const content = typeof children === 'function' ? children(activeApp) : children;

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <TabBar />
      <div className="flex-1 overflow-auto workspace-scroll bg-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeApp}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            <AppErrorBoundary key={activeApp}>
              {content}
            </AppErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
