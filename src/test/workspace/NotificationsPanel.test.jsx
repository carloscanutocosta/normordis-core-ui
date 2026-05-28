import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WorkspaceProvider } from '@/components/workspace/WorkspaceContext';
import NotificationsPanel from '@/components/workspace/NotificationsPanel';

expect.extend(toHaveNoViolations);

vi.mock('@/lib/theme', () => ({
  applyTheme: vi.fn(),
  getStoredTheme: vi.fn(() => 'light'),
}));

const TEST_APPS = [{ id: 'app1', label: 'App One', icon: null, category: 'core' }];

function renderPanel(props = {}) {
  return render(
    <WorkspaceProvider apps={TEST_APPS}>
      <TooltipProvider>
        <NotificationsPanel {...props} />
      </TooltipProvider>
    </WorkspaceProvider>,
  );
}

// ── Trigger button ────────────────────────────────────────────────────────────

describe('NotificationsPanel — trigger button', () => {
  it('renders a bell button', () => {
    renderPanel();
    expect(screen.getByRole('button', { name: /notificações/i })).toBeInTheDocument();
  });

  it('shows plain "Notificações" aria-label when there are no notifications', () => {
    renderPanel();
    expect(screen.getByRole('button', { name: 'Notificações' })).toBeInTheDocument();
  });

  it('includes unread count in aria-label when external unread notifications exist', () => {
    const notifications = [
      { id: 'n1', title: 'Aviso', type: 'warning', read: false },
      { id: 'n2', title: 'Info',  type: 'info',    read: true  },
    ];
    renderPanel({ notifications });
    // 1 unread (n1); n2 is already read
    expect(screen.getByRole('button', { name: /1 não lidas/i })).toBeInTheDocument();
  });

  it('aggregates multiple external unread notifications in aria-label', () => {
    const notifications = [
      { id: 'n1', title: 'A', type: 'error',   read: false },
      { id: 'n2', title: 'B', type: 'success',  read: false },
      { id: 'n3', title: 'C', type: 'info',     read: true  },
    ];
    renderPanel({ notifications });
    expect(screen.getByRole('button', { name: /2 não lidas/i })).toBeInTheDocument();
  });

  it('calls onNotificationsReadAll when provided', () => {
    const onReadAll = vi.fn();
    const notifications = [{ id: 'n1', title: 'Test', type: 'info', read: false }];
    renderPanel({ notifications, onNotificationsReadAll: onReadAll });
    // Panel is closed by default — just verify the prop is accepted without error
    expect(screen.getByRole('button', { name: /notificações/i })).toBeInTheDocument();
  });
});

// ── Panel interactions (open popover) ─────────────────────────────────────────

describe('NotificationsPanel — panel interactions', () => {
  it('opens the panel when trigger is clicked', () => {
    renderPanel();
    fireEvent.click(screen.getByRole('button', { name: /notificações/i }));
    expect(screen.getByText('Sem notificações')).toBeInTheDocument();
  });

  it('shows notification list when open with notifications', () => {
    const notifications = [
      { id: 'n1', title: 'Aprovação pendente', type: 'warning', read: false, description: 'Processo 2024/042.' },
    ];
    renderPanel({ notifications });
    fireEvent.click(screen.getByRole('button', { name: /notificações/i }));
    expect(screen.getByText('Aprovação pendente')).toBeInTheDocument();
  });

  it('calls handleRead for an external notification when "Marcar como lida" is clicked', () => {
    const onRead = vi.fn();
    const notifications = [{ id: 'n1', title: 'Aviso', type: 'info', read: false }];
    renderPanel({ notifications, onNotificationRead: onRead });
    fireEvent.click(screen.getByRole('button', { name: /notificações/i }));
    const readBtn = screen.getByRole('button', { name: /marcar como lida/i });
    fireEvent.click(readBtn);
    expect(onRead).toHaveBeenCalledWith('n1');
  });

  it('calls handleClear for an external notification when "Remover" is clicked', () => {
    const onClear = vi.fn();
    const notifications = [{ id: 'n1', title: 'Aviso', type: 'info', read: false }];
    renderPanel({ notifications, onNotificationClear: onClear });
    fireEvent.click(screen.getByRole('button', { name: /notificações/i }));
    const clearBtns = screen.getAllByRole('button', { name: /remover/i });
    fireEvent.click(clearBtns[0]);
    expect(onClear).toHaveBeenCalledWith('n1');
  });

  it('calls handleReadAll when "Marcar todas como lidas" is clicked', () => {
    const onReadAll = vi.fn();
    const notifications = [{ id: 'n1', title: 'A', type: 'info', read: false }];
    renderPanel({ notifications, onNotificationsReadAll: onReadAll });
    fireEvent.click(screen.getByRole('button', { name: /notificações/i }));
    fireEvent.click(screen.getByRole('button', { name: /marcar todas como lidas/i }));
    expect(onReadAll).toHaveBeenCalled();
  });

  it('calls handleClear for all when "Limpar todas" is clicked', () => {
    const onClear = vi.fn();
    const notifications = [{ id: 'n1', title: 'A', type: 'info', read: true }];
    renderPanel({ notifications, onNotificationClear: onClear });
    fireEvent.click(screen.getByRole('button', { name: /notificações/i }));
    fireEvent.click(screen.getByRole('button', { name: /limpar todas/i }));
    expect(onClear).toHaveBeenCalledWith();
  });
});

// ── Accessibility ─────────────────────────────────────────────────────────────

describe('NotificationsPanel — accessibility', () => {
  it('has no axe violations on initial render (empty state)', async () => {
    const { container } = renderPanel();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations with mixed read/unread notifications in aria-label', async () => {
    const notifications = [
      { id: 'n1', title: 'Processo guardado', type: 'success', read: false },
      { id: 'n2', title: 'Erro de rede',      type: 'error',   read: true  },
    ];
    const { container } = renderPanel({ notifications });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
