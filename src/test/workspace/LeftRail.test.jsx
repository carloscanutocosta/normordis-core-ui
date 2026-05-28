import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { LayoutDashboard, FileText, Settings } from 'lucide-react';
import { WorkspaceProvider, useWorkspace } from '@/components/workspace/WorkspaceContext';
import LeftRail from '@/components/workspace/LeftRail';

expect.extend(toHaveNoViolations);

vi.mock('@/lib/theme', () => ({
  applyTheme: vi.fn(),
  getStoredTheme: vi.fn(() => 'light'),
}));

const APPS = [
  { id: 'app1', label: 'Dashboard',  icon: LayoutDashboard, category: 'core'   },
  { id: 'app2', label: 'Documentos', icon: FileText,         category: 'core'   },
  { id: 'sys1', label: 'Definições', icon: Settings,         category: 'system' },
];

function renderRail(apps = APPS, rightTools = []) {
  return render(
    <WorkspaceProvider apps={apps} rightTools={rightTools}>
      <LeftRail />
    </WorkspaceProvider>,
  );
}

describe('LeftRail — render', () => {
  it('renders a nav element with aria-label', () => {
    renderRail();
    expect(screen.getByRole('navigation', { name: /navegação principal/i })).toBeInTheDocument();
  });

  it('renders a button for each core app', () => {
    renderRail();
    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /documentos/i })).toBeInTheDocument();
  });

  it('renders system apps in the same navigation', () => {
    renderRail();
    expect(screen.getByRole('button', { name: /definições/i })).toBeInTheDocument();
  });

  it('marks the active app with aria-current="page"', () => {
    renderRail();
    const dashBtn = screen.getByRole('button', { name: /dashboard/i });
    expect(dashBtn).toHaveAttribute('aria-current', 'page');
  });

  it('renders collapse/expand toggle button', () => {
    renderRail();
    expect(screen.getByRole('button', { name: /colapsar navegação/i })).toBeInTheDocument();
  });
});

describe('LeftRail — interactions', () => {
  it('clicking an app button opens that app', () => {
    let capturedWs;
    function Inspector() { capturedWs = useWorkspace(); return null; }
    render(
      <WorkspaceProvider apps={APPS}>
        <LeftRail />
        <Inspector />
      </WorkspaceProvider>,
    );
    expect(capturedWs.activeApp).toBe('app1');
    fireEvent.click(screen.getByRole('button', { name: /documentos/i }));
    expect(capturedWs.activeApp).toBe('app2');
  });

  it('clicking the collapse button toggles the rail', () => {
    let capturedWs;
    function Inspector() { capturedWs = useWorkspace(); return null; }
    render(
      <WorkspaceProvider apps={APPS}>
        <LeftRail />
        <Inspector />
      </WorkspaceProvider>,
    );
    expect(capturedWs.leftRailCollapsed).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: /colapsar navegação/i }));
    expect(capturedWs.leftRailCollapsed).toBe(true);
  });
});

describe('LeftRail — badges', () => {
  it('shows badge count when setAppBadge is called', () => {
    let ws;
    function Setter() { ws = useWorkspace(); return null; }
    const { rerender } = render(
      <WorkspaceProvider apps={APPS}>
        <LeftRail />
        <Setter />
      </WorkspaceProvider>,
    );
    const { act } = require('@testing-library/react');
    act(() => ws.setAppBadge('app2', 7));
    expect(screen.getByText('7')).toBeInTheDocument();
  });
});

describe('LeftRail — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = renderRail();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
