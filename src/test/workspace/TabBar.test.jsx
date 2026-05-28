import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useWorkspace } from '@/components/workspace/WorkspaceContext';
import { axe, toHaveNoViolations } from 'jest-axe';
import { WorkspaceProvider } from '@/components/workspace/WorkspaceContext';
import TabBar from '@/components/workspace/TabBar';

expect.extend(toHaveNoViolations);

vi.mock('@/lib/theme', () => ({
  applyTheme: vi.fn(),
  getStoredTheme: vi.fn(() => 'light'),
}));

const APPS = [
  { id: 'app1', label: 'Dashboard', icon: null, category: 'core' },
  { id: 'app2', label: 'Documentos', icon: null, category: 'core' },
];

function renderTabBar(apps = APPS) {
  return render(
    <WorkspaceProvider apps={apps}>
      <TabBar />
    </WorkspaceProvider>,
  );
}

describe('TabBar — render', () => {
  it('renders a tablist with aria-label', () => {
    renderTabBar();
    expect(screen.getByRole('tablist', { name: /apps abertas/i })).toBeInTheDocument();
  });

  it('shows the first app tab by default', () => {
    renderTabBar();
    expect(screen.getByRole('tab', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('returns null (renders nothing) when apps list is empty', () => {
    const { container } = renderTabBar([]);
    expect(container.firstChild).toBeNull();
  });

  it('marks the active tab with aria-selected="true"', () => {
    renderTabBar();
    const tab = screen.getByRole('tab', { name: /dashboard/i });
    expect(tab).toHaveAttribute('aria-selected', 'true');
  });

  it('marks inactive tabs with aria-selected="false"', () => {
    // Seed session with two open tabs so both render in the TabBar
    sessionStorage.setItem('normordis-workspace-session', JSON.stringify({
      activeApp: 'app1',
      openTabs: [{ id: 'app1', label: 'Dashboard' }, { id: 'app2', label: 'Documentos' }],
      leftRailCollapsed: false,
      atendimento: { started: false, startTime: null, step: 0, form: null },
    }));
    renderTabBar();
    const tab2 = screen.getByRole('tab', { name: /documentos/i });
    expect(tab2).toHaveAttribute('aria-selected', 'false');
  });
});

describe('TabBar — interactions', () => {
  it('does not show a close button when only one tab is open', () => {
    renderTabBar([APPS[0]]);
    expect(screen.queryByRole('button', { name: /fechar/i })).toBeNull();
  });

  it('shows close buttons when two tabs are open', () => {
    sessionStorage.setItem('normordis-workspace-session', JSON.stringify({
      activeApp: 'app1',
      openTabs: [{ id: 'app1', label: 'Dashboard' }, { id: 'app2', label: 'Documentos' }],
      leftRailCollapsed: false,
      atendimento: { started: false, startTime: null, step: 0, form: null },
    }));
    renderTabBar();
    // Close buttons appear on hover via CSS; they exist in the DOM even without hover
    const closeBtns = screen.getAllByRole('button', { name: /fechar/i });
    expect(closeBtns.length).toBe(2);
  });

  it('closes a tab when its close button is clicked', () => {
    sessionStorage.setItem('normordis-workspace-session', JSON.stringify({
      activeApp: 'app1',
      openTabs: [{ id: 'app1', label: 'Dashboard' }, { id: 'app2', label: 'Documentos' }],
      leftRailCollapsed: false,
      atendimento: { started: false, startTime: null, step: 0, form: null },
    }));
    let ws;
    function Inspector() { ws = useWorkspace(); return null; }
    render(
      <WorkspaceProvider apps={APPS}>
        <TabBar />
        <Inspector />
      </WorkspaceProvider>,
    );
    expect(ws.openTabs).toHaveLength(2);
    const closeBtns = screen.getAllByRole('button', { name: /fechar documentos/i });
    fireEvent.click(closeBtns[0]);
    expect(ws.openTabs).toHaveLength(1);
  });
});

describe('TabBar — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = renderTabBar();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
