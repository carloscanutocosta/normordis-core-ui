import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { WorkspaceProvider, useWorkspace } from '@/components/workspace/WorkspaceContext';
import RightRail from '@/components/workspace/RightRail';

expect.extend(toHaveNoViolations);

vi.mock('@/lib/theme', () => ({
  applyTheme: vi.fn(),
  getStoredTheme: vi.fn(() => 'light'),
}));

const TOOLS = [
  { id: 'filters', label: 'Filtros', icon: Filter },
  { id: 'properties', label: 'Propriedades', icon: SlidersHorizontal },
];

const APPS = [{ id: 'app1', label: 'App One', icon: null, category: 'core' }];

function renderRail(tools = TOOLS) {
  return render(
    <WorkspaceProvider apps={APPS} rightTools={tools}>
      <RightRail />
    </WorkspaceProvider>,
  );
}

describe('RightRail — render', () => {
  it('renders nothing when there are no tools', () => {
    const { container } = renderRail([]);
    expect(container.firstChild).toBeNull();
  });

  it('renders an aside with aria-label when tools are provided', () => {
    renderRail();
    expect(screen.getByRole('complementary', { name: /ferramentas/i })).toBeInTheDocument();
  });

  it('renders a button for each tool', () => {
    renderRail();
    expect(screen.getByRole('button', { name: 'Filtros' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Propriedades' })).toBeInTheDocument();
  });

  it('tool buttons start with aria-pressed="false"', () => {
    renderRail();
    expect(screen.getByRole('button', { name: 'Filtros' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});

describe('RightRail — interactions', () => {
  it('toggles a tool open when its button is clicked', () => {
    let ws;
    function Inspector() {
      ws = useWorkspace();
      return null;
    }
    render(
      <WorkspaceProvider apps={APPS} rightTools={TOOLS}>
        <RightRail />
        <Inspector />
      </WorkspaceProvider>,
    );
    expect(ws.activeTool).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Filtros' }));
    expect(ws.activeTool).toBe('filters');
    expect(ws.rightPanelOpen).toBe(true);
  });

  it('closes the tool when its button is clicked again', () => {
    let ws;
    function Inspector() {
      ws = useWorkspace();
      return null;
    }
    render(
      <WorkspaceProvider apps={APPS} rightTools={TOOLS}>
        <RightRail />
        <Inspector />
      </WorkspaceProvider>,
    );
    const btn = screen.getByRole('button', { name: 'Filtros' });
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(ws.activeTool).toBeNull();
    expect(ws.rightPanelOpen).toBe(false);
  });
});

describe('RightRail — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = renderRail();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
