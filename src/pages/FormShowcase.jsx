import React, { useState } from 'react';
import ThemeSwitcher from '../components/ThemeSwitcher';
import InputsSection from '../components/showcase/InputsSection';
import OutputsSection from '../components/showcase/OutputsSection';
import SpinnersSection from '../components/showcase/SpinnersSection';
import DataSection from '../components/showcase/DataSection';
import FormsAdvancedSection from '../components/showcase/FormsAdvancedSection';
import ChartsSection from '../components/showcase/ChartsSection';
import DataAdvancedSection from '../components/showcase/DataAdvancedSection';
import UIExtrasSection from '../components/showcase/UIExtrasSection';
import LayoutSection from '../components/showcase/LayoutSection';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

// ── Tab system (Edge-style: tab groups + sub-tabs) ─────────────────────────

const TAB_GROUPS = [
  {
    id: 'forms',
    label: 'Formulários',
    color: 'text-blue-600',
    activeBg: 'bg-blue-50 border-blue-200',
    tabs: [
      { id: 'inputs', label: 'Inputs básicos', component: InputsSection },
      { id: 'forms-adv', label: 'Inputs avançados', component: FormsAdvancedSection },
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

// flatten for lookup
const ALL_TABS = TAB_GROUPS.flatMap((g) => g.tabs.map((t) => ({ ...t, group: g })));

export default function FormShowcase() {
  const [activeGroup, setActiveGroup] = useState(TAB_GROUPS[0].id);
  const [activeTab, setActiveTab] = useState(TAB_GROUPS[0].tabs[0].id);

  const currentGroup = TAB_GROUPS.find((g) => g.id === activeGroup) || TAB_GROUPS[0];
  const currentTab = ALL_TABS.find((t) => t.id === activeTab) || ALL_TABS[0];
  const ActiveComponent = currentTab.component;

  const selectGroup = (group) => {
    setActiveGroup(group.id);
    setActiveTab(group.tabs[0].id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="border-b border-border bg-card sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Biblioteca de Componentes
              </h1>
              <p className="text-xs text-muted-foreground">
                Sistema de design completo e reutilizável
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/automations"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
              >
                <Zap className="h-4 w-4" /> Automações
              </Link>
              <ThemeSwitcher />
            </div>
          </div>

          {/* ── GROUP TABS (Edge-style top strip) ───────────────────── */}
          <div className="flex items-end gap-0.5 -mb-px overflow-x-auto">
            {TAB_GROUPS.map((group) => {
              const isActive = activeGroup === group.id;
              return (
                <button
                  key={group.id}
                  onClick={() => selectGroup(group)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-t-lg border border-b-0 transition-all whitespace-nowrap',
                    isActive
                      ? `${group.activeBg} ${group.color} border-border`
                      : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50',
                  )}
                >
                  {group.label}
                  <span
                    className={cn(
                      'text-[10px] font-semibold rounded-full px-1.5 py-0.5',
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
      </div>

      {/* ── SUB-TABS (within active group) ────────────────────────────── */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-[73px] z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-2 overflow-x-auto">
            {currentGroup.tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-md transition-all whitespace-nowrap',
                    isActive
                      ? `${currentGroup.activeBg} ${currentGroup.color} font-medium border`
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <ActiveComponent />
      </div>
    </div>
  );
}
