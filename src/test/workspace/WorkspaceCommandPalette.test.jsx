import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { LayoutDashboard, FileText, Plus } from 'lucide-react';
import { WorkspaceProvider, useWorkspace } from '@/components/workspace/WorkspaceContext';
import WorkspaceCommandPalette from '@/components/workspace/WorkspaceCommandPalette';

expect.extend(toHaveNoViolations);

vi.mock('@/lib/theme', () => ({
  applyTheme: vi.fn(),
  getStoredTheme: vi.fn(() => 'light'),
}));

const APPS = [
  { id: 'app1', label: 'Dashboard',  icon: LayoutDashboard, category: 'core'   },
  { id: 'app2', label: 'Documentos', icon: FileText,         category: 'core'   },
  { id: 'sys1', label: 'Definições', icon: null,             category: 'system' },
];

const COMMANDS = [
  { id: 'new', label: 'Novo Processo', icon: Plus, description: 'Abre formulário', onSelect: vi.fn() },
];

function renderPalette(props = {}) {
  return render(
    <WorkspaceProvider apps={APPS}>
      <WorkspaceCommandPalette {...props} />
    </WorkspaceProvider>,
  );
}

describe('WorkspaceCommandPalette — keyboard trigger', () => {
  it('opens with Ctrl+K', () => {
    let ws;
    function Inspector() { ws = useWorkspace(); return null; }
    render(
      <WorkspaceProvider apps={APPS}>
        <WorkspaceCommandPalette />
        <Inspector />
      </WorkspaceProvider>,
    );
    expect(ws.commandOpen).toBe(false);
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(ws.commandOpen).toBe(true);
  });

  it('closes with Ctrl+K when already open', () => {
    let ws;
    function Inspector() { ws = useWorkspace(); return null; }
    render(
      <WorkspaceProvider apps={APPS}>
        <WorkspaceCommandPalette />
        <Inspector />
      </WorkspaceProvider>,
    );
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(ws.commandOpen).toBe(true);
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(ws.commandOpen).toBe(false);
  });

  it('opens with Meta+K (macOS)', () => {
    let ws;
    function Inspector() { ws = useWorkspace(); return null; }
    render(
      <WorkspaceProvider apps={APPS}>
        <WorkspaceCommandPalette />
        <Inspector />
      </WorkspaceProvider>,
    );
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(ws.commandOpen).toBe(true);
  });

  it('does not open on Ctrl+other keys', () => {
    let ws;
    function Inspector() { ws = useWorkspace(); return null; }
    render(
      <WorkspaceProvider apps={APPS}>
        <WorkspaceCommandPalette />
        <Inspector />
      </WorkspaceProvider>,
    );
    fireEvent.keyDown(window, { key: 'j', ctrlKey: true });
    expect(ws.commandOpen).toBe(false);
  });

  it('removes keydown listener on unmount', () => {
    const { unmount } = renderPalette();
    const spy = vi.spyOn(window, 'removeEventListener');
    unmount();
    expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});

describe('WorkspaceCommandPalette — static commands', () => {
  it('accepts a commands prop without errors', () => {
    expect(() => renderPalette({ commands: COMMANDS })).not.toThrow();
  });
});

describe('WorkspaceCommandPalette — accessibility', () => {
  it('has no axe violations when closed', async () => {
    const { container } = renderPalette({ commands: COMMANDS });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
