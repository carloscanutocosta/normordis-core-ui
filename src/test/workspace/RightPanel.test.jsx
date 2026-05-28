import { describe, it, expect, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Filter } from 'lucide-react';
import { WorkspaceProvider, useWorkspace } from '@/components/workspace/WorkspaceContext';
import RightPanel from '@/components/workspace/RightPanel';

expect.extend(toHaveNoViolations);

vi.mock('@/lib/theme', () => ({
  applyTheme: vi.fn(),
  getStoredTheme: vi.fn(() => 'light'),
}));

const TOOLS = [{ id: 'filters', label: 'Filtros', icon: Filter }];
const APPS = [{ id: 'app1', label: 'App One', icon: null, category: 'core' }];

const PANELS = {
  filters: {
    title: 'Filtros',
    icon: Filter,
    content: <div>Conteúdo dos filtros</div>,
  },
};

function Opener({ toolId }) {
  const { toggleTool } = useWorkspace();
  return <button onClick={() => toggleTool(toolId)}>Abrir {toolId}</button>;
}

function renderPanel(panels = PANELS) {
  return render(
    <WorkspaceProvider apps={APPS} rightTools={TOOLS}>
      <Opener toolId="filters" />
      <RightPanel panels={panels} />
    </WorkspaceProvider>,
  );
}

describe('RightPanel — closed state', () => {
  it('renders nothing when no tool is active', () => {
    const { container } = renderPanel();
    expect(screen.queryByText('Filtros')).toBeNull();
  });
});

describe('RightPanel — open state', () => {
  it('shows panel title and content when tool is activated', async () => {
    renderPanel();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /abrir filters/i }));
    });
    expect(screen.getByText('Filtros')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo dos filtros')).toBeInTheDocument();
  });

  it('has a close button that deactivates the tool', async () => {
    let ws;
    function Inspector() {
      ws = useWorkspace();
      return null;
    }
    render(
      <WorkspaceProvider apps={APPS} rightTools={TOOLS}>
        <Opener toolId="filters" />
        <RightPanel panels={PANELS} />
        <Inspector />
      </WorkspaceProvider>,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /abrir filters/i }));
    });
    expect(ws.rightPanelOpen).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /fechar painel/i }));
    expect(ws.rightPanelOpen).toBe(false);
  });

  it('renders nothing when panel definition is missing for active tool', async () => {
    const { container } = render(
      <WorkspaceProvider apps={APPS} rightTools={TOOLS}>
        <Opener toolId="filters" />
        <RightPanel panels={{}} />
      </WorkspaceProvider>,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /abrir filters/i }));
    });
    expect(screen.queryByRole('button', { name: /fechar painel/i })).toBeNull();
  });
});

describe('RightPanel — accessibility', () => {
  it('has no axe violations when closed', async () => {
    const { container } = renderPanel();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations when open', async () => {
    const { container } = renderPanel();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /abrir filters/i }));
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
