import { useState, lazy, Suspense, Component } from 'react';
import { cn } from '@/lib/utils';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import InputsSection from '@/components/showcase/InputsSection';
import OutputsSection from '@/components/showcase/OutputsSection';
import SpinnersSection from '@/components/showcase/SpinnersSection';
import DataSection from '@/components/showcase/DataSection';
import FormsAdvancedSection from '@/components/showcase/FormsAdvancedSection';
import ChartsSection from '@/components/showcase/ChartsSection';
import DataAdvancedSection from '@/components/showcase/DataAdvancedSection';
import UIExtrasSection from '@/components/showcase/UIExtrasSection';
import LayoutSection from '@/components/showcase/LayoutSection';

const EditorPlayground = lazy(() =>
  import('./EditorPlayground').catch(() => ({
    default: () => (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
        <strong>Editor não disponível</strong> — as dependências Lexical não estão instaladas neste
        ambiente.
        <br />
        <code className="mt-1 block text-xs opacity-70">
          pnpm add lexical @lexical/react @lexical/rich-text @lexical/list @lexical/link
          @lexical/history @lexical/code @lexical/selection @lexical/utils @lexical/overflow
        </code>
      </div>
    ),
  })),
);

class TabErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-800">
          <strong>Erro ao carregar componente</strong>
          <pre className="mt-2 overflow-auto text-xs opacity-70">{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const TAB_GROUPS = [
  {
    id: 'forms',
    label: 'Formulários',
    color: 'text-blue-600',
    activeBg: 'bg-blue-50 border-blue-200',
    tabs: [
      { id: 'inputs', label: 'Inputs básicos', component: InputsSection },
      { id: 'forms-adv', label: 'Inputs avançados', component: FormsAdvancedSection },
      { id: 'editor', label: 'Editor NCRTF', component: EditorPlayground },
    ],
  },
  {
    id: 'display',
    label: 'Display',
    color: 'text-purple-600',
    activeBg: 'bg-purple-50 border-purple-200',
    tabs: [
      { id: 'outputs', label: 'Outputs', component: OutputsSection },
      { id: 'spinners', label: 'Spinners', component: SpinnersSection },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    color: 'text-indigo-600',
    activeBg: 'bg-indigo-50 border-indigo-200',
    tabs: [
      { id: 'data-basic', label: 'Tabelas & Listas', component: DataSection },
      { id: 'data-adv', label: 'Avançado', component: DataAdvancedSection },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    color: 'text-teal-600',
    activeBg: 'bg-teal-50 border-teal-200',
    tabs: [{ id: 'charts-all', label: 'Gráficos', component: ChartsSection }],
  },
  {
    id: 'ui',
    label: 'UI & Utils',
    color: 'text-amber-600',
    activeBg: 'bg-amber-50 border-amber-200',
    tabs: [
      { id: 'ui-extras', label: 'Componentes UI', component: UIExtrasSection },
      { id: 'layouts', label: 'Layouts', component: LayoutSection },
    ],
  },
];

const ALL_TABS = TAB_GROUPS.flatMap((group) => group.tabs.map((tab) => ({ ...tab, group })));

export default function ComponentPlayground() {
  const [activeGroup, setActiveGroup] = useState(TAB_GROUPS[0].id);
  const [activeTab, setActiveTab] = useState('inputs');

  const currentGroup = TAB_GROUPS.find((group) => group.id === activeGroup) ?? TAB_GROUPS[0];
  const currentTab = ALL_TABS.find((tab) => tab.id === activeTab) ?? ALL_TABS[0];
  const ActiveComponent = currentTab.component;

  const selectGroup = (group) => {
    setActiveGroup(group.id);
    setActiveTab(group.tabs[0].id);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Playground core-ui
              </h1>
              <p className="text-xs text-muted-foreground">
                Demonstração local dos componentes, temas e padrões do SDK
              </p>
            </div>
            <ThemeSwitcher />
          </div>

          <div className="-mb-px flex items-end gap-0.5 overflow-x-auto">
            {TAB_GROUPS.map((group) => {
              const isActive = activeGroup === group.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => selectGroup(group)}
                  className={cn(
                    'flex items-center gap-1.5 whitespace-nowrap rounded-t-lg border border-b-0 px-4 py-2 text-sm font-medium transition-all',
                    isActive
                      ? `${group.activeBg} ${group.color} border-border`
                      : 'border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  )}
                >
                  {group.label}
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                      isActive ? 'bg-white/60' : 'bg-muted',
                    )}
                  >
                    {group.tabs.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="sticky top-[73px] z-10 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {currentGroup.tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-all',
                    isActive
                      ? `${currentGroup.activeBg} ${currentGroup.color} border font-medium`
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <TabErrorBoundary key={activeTab}>
          <Suspense
            fallback={
              <div className="py-12 text-center text-sm text-muted-foreground">A carregar...</div>
            }
          >
            <ActiveComponent />
          </Suspense>
        </TabErrorBoundary>
      </main>
    </div>
  );
}
