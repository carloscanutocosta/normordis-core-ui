import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  WorkspaceProvider,
  useWorkspace,
  AppIdContext,
} from '@/components/workspace/WorkspaceContext';
import { useApp } from '@/hooks/use-app';

vi.mock('@/lib/theme', () => ({
  applyTheme: vi.fn(),
  getStoredTheme: vi.fn(() => 'light'),
}));

const TEST_APPS = [
  { id: 'app1', label: 'App One', icon: null, category: 'core' },
  { id: 'app2', label: 'App Two', icon: null, category: 'core' },
];

// Full context tree: WorkspaceProvider + AppIdContext set to "app1"
const wrapperWithApp = ({ children }) => (
  <WorkspaceProvider apps={TEST_APPS}>
    <AppIdContext.Provider value="app1">{children}</AppIdContext.Provider>
  </WorkspaceProvider>
);

// No AppIdContext — simulates a component rendered outside AppShell
const wrapperWithoutAppId = ({ children }) => (
  <WorkspaceProvider apps={TEST_APPS}>{children}</WorkspaceProvider>
);

// ── Error boundary ────────────────────────────────────────────────────────────

describe('useApp — error boundary', () => {
  it('throws when AppIdContext is not provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useApp(), { wrapper: wrapperWithoutAppId })).toThrow(
      'useApp() must be called inside a component rendered by AppShell',
    );
    spy.mockRestore();
  });
});

// ── Identity ──────────────────────────────────────────────────────────────────

describe('useApp — identity', () => {
  it('returns the appId from AppIdContext', () => {
    const { result } = renderHook(() => useApp(), { wrapper: wrapperWithApp });
    expect(result.current.appId).toBe('app1');
  });

  it('returns undefined params when no params have been passed to the app', () => {
    const { result } = renderHook(() => useApp(), { wrapper: wrapperWithApp });
    expect(result.current.params).toBeUndefined();
  });
});

// ── navigate ──────────────────────────────────────────────────────────────────

describe('useApp — navigate', () => {
  it('switches the workspace active app', () => {
    const { result } = renderHook(() => ({ app: useApp(), ws: useWorkspace() }), {
      wrapper: wrapperWithApp,
    });
    act(() => result.current.app.navigate('app2'));
    expect(result.current.ws.activeApp).toBe('app2');
  });

  it('stores params on the target app', () => {
    const { result } = renderHook(() => ({ app: useApp(), ws: useWorkspace() }), {
      wrapper: wrapperWithApp,
    });
    act(() => result.current.app.navigate('app2', { id: 99 }));
    expect(result.current.ws.appParams['app2']).toEqual({ id: 99 });
  });
});

// ── notify ────────────────────────────────────────────────────────────────────

describe('useApp — notify', () => {
  it('posts a notification visible in WorkspaceContext', () => {
    const { result } = renderHook(() => ({ app: useApp(), ws: useWorkspace() }), {
      wrapper: wrapperWithApp,
    });
    act(() => result.current.app.notify({ title: 'Guardado', type: 'success' }));
    expect(result.current.ws.internalNotifications).toHaveLength(1);
    expect(result.current.ws.internalNotifications[0].title).toBe('Guardado');
    expect(result.current.ws.internalNotifications[0].read).toBe(false);
  });
});

// ── setBadge ──────────────────────────────────────────────────────────────────

describe('useApp — setBadge', () => {
  it('sets the badge count only on the current app', () => {
    const { result } = renderHook(() => ({ app: useApp(), ws: useWorkspace() }), {
      wrapper: wrapperWithApp,
    });
    act(() => result.current.app.setBadge(5));
    expect(result.current.ws.appBadges['app1']).toBe(5);
    expect(result.current.ws.appBadges['app2']).toBeUndefined();
  });

  it('updates badge to zero (clears)', () => {
    const { result } = renderHook(() => ({ app: useApp(), ws: useWorkspace() }), {
      wrapper: wrapperWithApp,
    });
    act(() => result.current.app.setBadge(3));
    act(() => result.current.app.setBadge(0));
    expect(result.current.ws.appBadges['app1']).toBe(0);
  });
});

// ── registerCommands ──────────────────────────────────────────────────────────

describe('useApp — registerCommands', () => {
  it('registers commands under the current app id', () => {
    const { result } = renderHook(() => ({ app: useApp(), ws: useWorkspace() }), {
      wrapper: wrapperWithApp,
    });
    const cmds = [{ id: 'new', label: 'Novo', onSelect: vi.fn() }];
    act(() => result.current.app.registerCommands(cmds));
    expect(result.current.ws.dynamicCommandsByApp['app1']).toHaveLength(1);
  });

  it('cleanup removes the commands from the palette', () => {
    const { result } = renderHook(() => ({ app: useApp(), ws: useWorkspace() }), {
      wrapper: wrapperWithApp,
    });
    let cleanup;
    act(() => {
      cleanup = result.current.app.registerCommands([
        { id: 'new', label: 'Novo', onSelect: vi.fn() },
      ]);
    });
    act(() => cleanup());
    expect(result.current.ws.dynamicCommandsByApp['app1']).toBeUndefined();
  });
});
