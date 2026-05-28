import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { WorkspaceProvider, useWorkspace } from '@/components/workspace/WorkspaceContext';
import Header from '@/components/workspace/Header';

expect.extend(toHaveNoViolations);

vi.mock('@/lib/theme', () => ({
  applyTheme: vi.fn(),
  getStoredTheme: vi.fn(() => 'light'),
  THEMES: [
    { id: 'light', label: 'Light', icon: 'Sun' },
    { id: 'dark', label: 'Dark', icon: 'Moon' },
  ],
}));

const APPS = [{ id: 'app1', label: 'App One', icon: null, category: 'core' }];

function renderHeader(props = {}) {
  return render(
    <WorkspaceProvider apps={APPS}>
      <Header {...props} />
    </WorkspaceProvider>,
  );
}

describe('Header — render', () => {
  it('renders a header element', () => {
    renderHeader();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('shows the default app name when no appName prop is given', () => {
    renderHeader();
    expect(screen.getByText('Workspace')).toBeInTheDocument();
  });

  it('shows a custom app name when provided', () => {
    renderHeader({ appName: 'Normordis' });
    expect(screen.getByText('Normordis')).toBeInTheDocument();
  });

  it('renders the search/command palette trigger button', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /abrir paleta/i })).toBeInTheDocument();
  });

  it('renders a hamburger button for mobile navigation', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /abrir navegação/i })).toBeInTheDocument();
  });

  it('shows user initials in avatar when user prop is provided', () => {
    renderHeader({ user: { name: 'Ana Ferreira' } });
    expect(screen.getByText('AF')).toBeInTheDocument();
  });

  it('shows "U" as fallback initials when user name is not provided', () => {
    renderHeader({ user: {} });
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  it('does not show user menu when no user or onLogout is passed', () => {
    renderHeader();
    expect(screen.queryByText('Terminar Sessão')).toBeNull();
  });

  it('renders a custom logo node when provided', () => {
    renderHeader({ logo: <img src="logo.png" alt="Logo" /> });
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });
});

describe('Header — interactions', () => {
  it('calls openCommand when search button is clicked', () => {
    let capturedWs;
    function Inspector() {
      capturedWs = useWorkspace();
      return null;
    }
    render(
      <WorkspaceProvider apps={APPS}>
        <Header />
        <Inspector />
      </WorkspaceProvider>,
    );
    expect(capturedWs.commandOpen).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: /abrir paleta/i }));
    expect(capturedWs.commandOpen).toBe(true);
  });
});

describe('Header — accessibility', () => {
  it('has no axe violations (minimal)', async () => {
    const { container } = renderHeader({ appName: 'Normordis' });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations with user info', async () => {
    const { container } = renderHeader({
      appName: 'Normordis',
      user: { name: 'Ana Ferreira', email: 'ana@example.com' },
      onLogout: vi.fn(),
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
