import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { WorkspaceProvider } from '@/components/workspace/WorkspaceContext';
import StatusBar from '@/components/workspace/StatusBar';

expect.extend(toHaveNoViolations);

vi.mock('@/lib/theme', () => ({
  applyTheme: vi.fn(),
  getStoredTheme: vi.fn(() => 'light'),
}));

const APPS = [{ id: 'app1', label: 'App One', icon: null, category: 'core' }];

function renderStatusBar(props = {}) {
  return render(
    <WorkspaceProvider apps={APPS}>
      <StatusBar {...props} />
    </WorkspaceProvider>,
  );
}

describe('StatusBar — render', () => {
  it('renders a footer element', () => {
    renderStatusBar({ showAtendimento: false });
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('shows "Online" when navigator.onLine is true', () => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    renderStatusBar({ showAtendimento: false });
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('shows the user name when user prop is provided', () => {
    renderStatusBar({ showAtendimento: false, user: { name: 'Carlos Costa' } });
    expect(screen.getByText('Carlos Costa')).toBeInTheDocument();
  });

  it('shows user email when name is absent', () => {
    renderStatusBar({ showAtendimento: false, user: { email: 'carlos@example.com' } });
    expect(screen.getByText('carlos@example.com')).toBeInTheDocument();
  });

  it('does not render user section when no user is provided', () => {
    renderStatusBar({ showAtendimento: false });
    expect(screen.queryByText('Carlos Costa')).toBeNull();
  });
});

describe('StatusBar — atendimento button', () => {
  it('shows "Registar Atendimento" button when showAtendimento is true', () => {
    renderStatusBar({ showAtendimento: true });
    expect(screen.getByText(/registar atendimento/i)).toBeInTheDocument();
  });

  it('hides the atendimento button when showAtendimento is false', () => {
    renderStatusBar({ showAtendimento: false });
    expect(screen.queryByText(/registar atendimento/i)).toBeNull();
  });
});

describe('StatusBar — accessibility', () => {
  it('has no axe violations (no atendimento)', async () => {
    const { container } = renderStatusBar({ showAtendimento: false });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations with user info', async () => {
    const { container } = renderStatusBar({
      showAtendimento: false,
      user: { name: 'Ana Ferreira' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
