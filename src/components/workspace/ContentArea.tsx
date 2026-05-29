import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkspace, AppIdContext } from './WorkspaceContext';
import TabBar from './TabBar';

// ─── Error boundary ────────────────────────────────────────────────────────────

interface ErrorBoundaryState {
  error: Error | null;
}

class AppErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Errors are surfaced to the UI; no additional logging needed here.
  }

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

// ─── ContentArea ──────────────────────────────────────────────────────────────

interface ContentAreaProps {
  /**
   * Render function called once per open tab. All tabs are mounted
   * simultaneously; inactive ones are hidden with `display: none`
   * to preserve scroll position, form values, and loaded data.
   */
  children: ((appId: string) => ReactNode) | ReactNode;
}

/**
 * Renders all open tabs simultaneously, hiding inactive ones with CSS.
 * Each app is wrapped in AppIdContext so useApp() knows which app it's inside.
 */
export default function ContentArea({ children }: ContentAreaProps) {
  const { openTabs, activeApp } = useWorkspace();

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <TabBar />
      <div className="flex-1 relative bg-background overflow-hidden">
        {openTabs.map((tab) => (
          <AppIdContext.Provider key={tab.id} value={tab.id}>
            <div
              className="absolute inset-0 overflow-auto workspace-scroll"
              style={{ display: activeApp === tab.id ? undefined : 'none' }}
            >
              <AppErrorBoundary>
                {typeof children === 'function' ? children(tab.id) : children}
              </AppErrorBoundary>
            </div>
          </AppIdContext.Provider>
        ))}
      </div>
    </div>
  );
}
