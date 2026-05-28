import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { WorkspaceProvider } from '@/components/workspace/WorkspaceContext';
import ContentArea from '@/components/workspace/ContentArea';

expect.extend(toHaveNoViolations);

vi.mock('@/lib/theme', () => ({
  applyTheme: vi.fn(),
  getStoredTheme: vi.fn(() => 'light'),
}));

const APPS = [
  { id: 'app1', label: 'Dashboard', icon: null, category: 'core' },
  { id: 'app2', label: 'Relatórios', icon: null, category: 'core' },
];

function renderContent(children, apps = APPS) {
  return render(
    <WorkspaceProvider apps={apps}>
      <ContentArea>{children}</ContentArea>
    </WorkspaceProvider>,
  );
}

describe('ContentArea — render', () => {
  it('renders content for the active tab', () => {
    renderContent((appId) => <div>{`App: ${appId}`}</div>);
    expect(screen.getByText('App: app1')).toBeInTheDocument();
  });

  it('renders a tab bar above the content', () => {
    renderContent(() => <div>content</div>);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('accepts static ReactNode children (not a function)', () => {
    renderContent(<div>Static child</div>);
    expect(screen.getByText('Static child')).toBeInTheDocument();
  });
});

describe('ContentArea — error boundary', () => {
  it('shows error UI when a child component throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Broken() { throw new Error('Test crash'); }
    renderContent(() => <Broken />);
    expect(screen.getByText(/erro ao carregar/i)).toBeInTheDocument();
    spy.mockRestore();
  });

  it('shows the error message in the error UI', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Broken() { throw new Error('Problema específico'); }
    renderContent(() => <Broken />);
    expect(screen.getByText(/problema específico/i)).toBeInTheDocument();
    spy.mockRestore();
  });

  it('shows a retry button in the error UI', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Broken() { throw new Error('crash'); }
    renderContent(() => <Broken />);
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument();
    spy.mockRestore();
  });
});

describe('ContentArea — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = renderContent((appId) => <main>{`App: ${appId}`}</main>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
