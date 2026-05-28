import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { WorkspaceProvider, useWorkspace } from '@/components/workspace/WorkspaceContext';

vi.mock('@/lib/theme', () => ({
  applyTheme: vi.fn(),
  getStoredTheme: vi.fn(() => 'light'),
}));

const TEST_APPS = [
  { id: 'app1', label: 'App One',  icon: null, category: 'core'   },
  { id: 'app2', label: 'App Two',  icon: null, category: 'core'   },
  { id: 'sys1', label: 'Sistema',  icon: null, category: 'system' },
];

const wrapper = ({ children }) => (
  <WorkspaceProvider apps={TEST_APPS}>{children}</WorkspaceProvider>
);

// ── Initial state ─────────────────────────────────────────────────────────────

describe('WorkspaceProvider — initial state', () => {
  it('exposes the first app as the active one', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    expect(result.current.activeApp).toBe('app1');
  });

  it('opens a single tab for the default app', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    expect(result.current.openTabs).toHaveLength(1);
    expect(result.current.openTabs[0]).toMatchObject({ id: 'app1', label: 'App One' });
  });

  it('starts with an empty badge map', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    expect(result.current.appBadges).toEqual({});
  });

  it('starts with no internal notifications', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    expect(result.current.internalNotifications).toHaveLength(0);
  });

  it('starts with no dynamic commands', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    expect(result.current.dynamicCommandsByApp).toEqual({});
  });

  it('starts with atendimento session inactive', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    expect(result.current.atendimento.started).toBe(false);
  });
});

// ── openApp ───────────────────────────────────────────────────────────────────

describe('WorkspaceProvider — openApp', () => {
  it('switches the active app', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    act(() => result.current.openApp('app2'));
    expect(result.current.activeApp).toBe('app2');
  });

  it('adds a new tab when opening an unloaded app', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    act(() => result.current.openApp('app2'));
    expect(result.current.openTabs).toHaveLength(2);
  });

  it('does not duplicate a tab that is already open', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    act(() => { result.current.openApp('app1'); });
    act(() => { result.current.openApp('app1'); });
    expect(result.current.openTabs).toHaveLength(1);
  });

  it('stores navigation params when provided', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    act(() => result.current.openApp('app2', { recordId: 42 }));
    expect(result.current.appParams['app2']).toEqual({ recordId: 42 });
  });

  it('silently ignores an unknown app id', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    act(() => result.current.openApp('ghost-app'));
    expect(result.current.activeApp).toBe('app1');
    expect(result.current.openTabs).toHaveLength(1);
  });
});

// ── closeTab ──────────────────────────────────────────────────────────────────

describe('WorkspaceProvider — closeTab', () => {
  it('removes the tab and reverts to the previous one', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    act(() => result.current.openApp('app2'));
    act(() => result.current.closeTab('app2'));
    expect(result.current.openTabs).toHaveLength(1);
    expect(result.current.activeApp).toBe('app1');
  });

  it('does not remove the last remaining tab', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    act(() => result.current.closeTab('app1'));
    expect(result.current.openTabs).toHaveLength(1);
  });
});

// ── setAppBadge ───────────────────────────────────────────────────────────────

describe('WorkspaceProvider — setAppBadge', () => {
  it('sets a numeric badge for an app', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    act(() => result.current.setAppBadge('app1', 7));
    expect(result.current.appBadges['app1']).toBe(7);
  });

  it('manages badge counts independently per app', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    act(() => { result.current.setAppBadge('app1', 3); });
    act(() => { result.current.setAppBadge('app2', 9); });
    expect(result.current.appBadges['app1']).toBe(3);
    expect(result.current.appBadges['app2']).toBe(9);
  });
});

// ── notifications ─────────────────────────────────────────────────────────────

describe('WorkspaceProvider — notifications', () => {
  it('prepends a new notification (most recent first)', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    act(() => result.current.notify({ title: 'First',  type: 'info'    }));
    act(() => result.current.notify({ title: 'Second', type: 'success' }));
    expect(result.current.internalNotifications[0].title).toBe('Second');
    expect(result.current.internalNotifications[1].title).toBe('First');
  });

  it('assigns a unique id and sets read:false on each notification', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    act(() => result.current.notify({ title: 'Test', type: 'info' }));
    const n = result.current.internalNotifications[0];
    expect(n.id).toBeDefined();
    expect(n.read).toBe(false);
  });

  it('marks a single notification as read by id', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    act(() => result.current.notify({ title: 'Test', type: 'info' }));
    const id = result.current.internalNotifications[0].id;
    act(() => result.current.readInternalNotification(id));
    expect(result.current.internalNotifications[0].read).toBe(true);
  });

  it('marks all notifications as read', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    act(() => result.current.notify({ title: 'A', type: 'info'    }));
    act(() => result.current.notify({ title: 'B', type: 'warning' }));
    act(() => result.current.readAllInternalNotifications());
    expect(result.current.internalNotifications.every(n => n.read)).toBe(true);
  });

  it('removes a single notification by id', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    act(() => result.current.notify({ title: 'A', type: 'info' }));
    act(() => result.current.notify({ title: 'B', type: 'info' }));
    const id = result.current.internalNotifications[0].id;
    act(() => result.current.clearInternalNotification(id));
    expect(result.current.internalNotifications).toHaveLength(1);
    expect(result.current.internalNotifications[0].title).toBe('A');
  });

  it('clears all notifications when called without an id', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    act(() => result.current.notify({ title: 'A', type: 'info' }));
    act(() => result.current.notify({ title: 'B', type: 'info' }));
    act(() => result.current.clearInternalNotification());
    expect(result.current.internalNotifications).toHaveLength(0);
  });
});

// ── registerCommands ──────────────────────────────────────────────────────────

describe('WorkspaceProvider — registerCommands', () => {
  it('registers commands for an app', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    const cmds = [{ id: 'c1', label: 'New Record', onSelect: vi.fn() }];
    act(() => result.current.registerCommands('app1', cmds));
    expect(result.current.dynamicCommandsByApp['app1']).toHaveLength(1);
  });

  it('returns a cleanup that removes the commands', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    let cleanup;
    act(() => {
      cleanup = result.current.registerCommands('app1', [
        { id: 'c1', label: 'X', onSelect: vi.fn() },
      ]);
    });
    act(() => cleanup());
    expect(result.current.dynamicCommandsByApp['app1']).toBeUndefined();
  });
});

// ── atendimento ───────────────────────────────────────────────────────────────

describe('WorkspaceProvider — atendimento', () => {
  it('updates atendimento via updateAtendimento', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    act(() => result.current.updateAtendimento({ started: true, step: 1 }));
    expect(result.current.atendimento.started).toBe(true);
    expect(result.current.atendimento.step).toBe(1);
  });

  it('resets atendimento to initial values', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    act(() => result.current.updateAtendimento({ started: true, step: 3 }));
    act(() => result.current.resetAtendimento());
    expect(result.current.atendimento).toEqual({
      started: false, startTime: null, step: 0, form: null,
    });
  });
});

// ── session persistence ───────────────────────────────────────────────────────

describe('WorkspaceProvider — session persistence', () => {
  const SESSION_KEY = 'normordis-workspace-session';

  it('restores activeApp and openTabs from sessionStorage', () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      activeApp: 'app2',
      openTabs: [
        { id: 'app1', label: 'App One' },
        { id: 'app2', label: 'App Two' },
      ],
      leftRailCollapsed: false,
      atendimento: { started: false, startTime: null, step: 0, form: null },
    }));
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    expect(result.current.activeApp).toBe('app2');
    expect(result.current.openTabs).toHaveLength(2);
  });

  it('ignores restored tabs for apps that no longer exist', () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      activeApp: 'app1',
      openTabs: [
        { id: 'app1', label: 'App One' },
        { id: 'ghost', label: 'Gone App' },
      ],
      leftRailCollapsed: false,
      atendimento: { started: false, startTime: null, step: 0, form: null },
    }));
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    expect(result.current.openTabs).toHaveLength(1);
    expect(result.current.openTabs[0].id).toBe('app1');
  });

  it('falls back to defaultApp when restored activeApp no longer exists', () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      activeApp: 'ghost',
      openTabs: [],
      leftRailCollapsed: false,
      atendimento: { started: false, startTime: null, step: 0, form: null },
    }));
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    expect(result.current.activeApp).toBe('app1');
  });

  it('restores atendimento in-progress state', () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      activeApp: 'app1',
      openTabs: [{ id: 'app1', label: 'App One' }],
      leftRailCollapsed: false,
      atendimento: {
        started: true,
        startTime: '2026-05-28T10:00:00.000Z',
        step: 2,
        form: { area: 'TI', assunto: 'Teste', descricao: '', resposta: '', canal: 'Email', prioridade: 'Normal', estado: 'Aberto', utilizador_contacto: 'user@example.com', duracao_minutos: '', notas_internas: '' },
      },
    }));
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    expect(result.current.atendimento.started).toBe(true);
    expect(result.current.atendimento.step).toBe(2);
    expect(result.current.atendimento.form?.area).toBe('TI');
  });

  it('writes session to sessionStorage when activeApp changes', () => {
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    act(() => { result.current.openApp('app2'); });
    const stored = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? '{}');
    expect(stored.activeApp).toBe('app2');
  });
});

// ── error boundary ────────────────────────────────────────────────────────────

describe('useWorkspace — error boundary', () => {
  it('throws when used outside WorkspaceProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useWorkspace())).toThrow(
      'useWorkspace must be used within WorkspaceProvider',
    );
    spy.mockRestore();
  });
});
