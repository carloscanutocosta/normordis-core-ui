import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import StatCard from '@/components/data/StatCard';
import AlertBanner from '@/components/data/AlertBanner';
import Breadcrumbs from '@/components/data/Breadcrumbs';
import Stepper from '@/components/data/Stepper';
import Timeline from '@/components/data/Timeline';
import DataTable from '@/components/data/DataTable';
import ListView from '@/components/data/ListView';

expect.extend(toHaveNoViolations);

// ── StatCard ───────────────────────────────────────────────────────────────────

describe('StatCard — render', () => {
  it('renders label and value', () => {
    render(<StatCard label="Utilizadores" value={1842} />);
    expect(screen.getByText('Utilizadores')).toBeInTheDocument();
    // toLocaleString output varies by jsdom locale — just verify the number is rendered
    expect(screen.getByText(/1[.,\s]?842|1842/)).toBeInTheDocument();
  });

  it('renders positive trend', () => {
    render(<StatCard label="Receita" value={100} trend={12} trendLabel="vs mês ant." />);
    expect(screen.getByText('+12%')).toBeInTheDocument();
    expect(screen.getByText('vs mês ant.')).toBeInTheDocument();
  });

  it('renders negative trend', () => {
    render(<StatCard label="Churn" value={5} trend={-2} />);
    expect(screen.getByText('-2%')).toBeInTheDocument();
  });

  it('renders prefix and suffix', () => {
    const { container } = render(<StatCard label="Receita" value={500} prefix="€ " suffix=" EUR" />);
    expect(container.textContent).toContain('€');
    expect(container.textContent).toContain('EUR');
  });

  it('renders text value without formatting', () => {
    render(<StatCard label="Estado" value="Operacional" />);
    expect(screen.getByText('Operacional')).toBeInTheDocument();
  });

  it('renders without trend section when trend is undefined', () => {
    render(<StatCard label="Label" value={42} />);
    expect(screen.queryByText('%')).toBeNull();
  });
});

describe('StatCard — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<StatCard label="Utilizadores activos" value={1842} trend={5.2} trendLabel="vs mês anterior" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── AlertBanner ────────────────────────────────────────────────────────────────

describe('AlertBanner — render', () => {
  it('renders title', () => {
    render(<AlertBanner variant="info" title="Informação importante" />);
    expect(screen.getByText('Informação importante')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<AlertBanner variant="warning" title="Aviso" description="Verifique os dados." />);
    expect(screen.getByText('Verifique os dados.')).toBeInTheDocument();
  });

  it.each(['info', 'success', 'warning', 'error'])(
    'renders variant "%s" without crashing',
    (variant) => {
      render(<AlertBanner variant={variant} title="Título" />);
    },
  );

  it('shows dismiss button when dismissible', () => {
    render(<AlertBanner variant="info" title="Aviso" dismissible />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('dismisses when X button is clicked', () => {
    const { container } = render(<AlertBanner variant="info" title="Aviso" dismissible />);
    fireEvent.click(screen.getByRole('button'));
    expect(container.firstChild).toBeNull();
  });
});

describe('AlertBanner — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<AlertBanner variant="warning" title="Sessão a expirar" description="Guarde o trabalho." dismissible />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── Breadcrumbs ────────────────────────────────────────────────────────────────

describe('Breadcrumbs — render', () => {
  const ITEMS = [
    { label: 'Início' },
    { label: 'Processos' },
    { label: 'Processo #1042' },
  ];

  it('renders a nav element', () => {
    render(<Breadcrumbs items={ITEMS} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders all item labels', () => {
    render(<Breadcrumbs items={ITEMS} />);
    expect(screen.getByText('Processos')).toBeInTheDocument();
    expect(screen.getByText('Processo #1042')).toBeInTheDocument();
  });

  it('renders the last item as non-interactive text', () => {
    render(<Breadcrumbs items={ITEMS} />);
    const last = screen.getByText('Processo #1042');
    expect(last.tagName).toBe('SPAN');
  });

  it('renders empty breadcrumbs without crashing', () => {
    render(<Breadcrumbs items={[]} />);
  });
});

describe('Breadcrumbs — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <Breadcrumbs items={[{ label: 'Início' }, { label: 'Clientes' }, { label: 'Empresa XYZ' }]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── Stepper ────────────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Conta', description: 'Crie as credenciais.' },
  { label: 'Perfil', description: 'Complete o perfil.' },
  { label: 'Conclusão', description: 'Tudo pronto!' },
];

describe('Stepper — render', () => {
  it('renders all step labels', () => {
    render(<Stepper steps={STEPS} />);
    // Labels appear in both indicator and content area — getAllByText is correct
    expect(screen.getAllByText('Conta').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Perfil').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Conclusão').length).toBeGreaterThan(0);
  });

  it('renders the first step description initially', () => {
    render(<Stepper steps={STEPS} />);
    expect(screen.getByText('Crie as credenciais.')).toBeInTheDocument();
  });

  it('navigates to next step on "Seguinte" click', () => {
    render(<Stepper steps={STEPS} />);
    fireEvent.click(screen.getByText('Seguinte'));
    expect(screen.getByText('Complete o perfil.')).toBeInTheDocument();
  });

  it('navigates back on "Anterior" click', () => {
    render(<Stepper steps={STEPS} />);
    fireEvent.click(screen.getByText('Seguinte'));
    fireEvent.click(screen.getByText('Anterior'));
    expect(screen.getByText('Crie as credenciais.')).toBeInTheDocument();
  });

  it('disables Anterior on first step', () => {
    render(<Stepper steps={STEPS} />);
    expect(screen.getByText('Anterior').closest('button')).toBeDisabled();
  });

  it('renders empty steps without crashing', () => {
    render(<Stepper steps={[]} />);
  });
});

describe('Stepper — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Stepper steps={STEPS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── Timeline ───────────────────────────────────────────────────────────────────

const TIMELINE_STEPS = [
  { id: 1, label: 'Submissão', status: 'completed', timestamp: '10 Jan' },
  { id: 2, label: 'Análise', status: 'active', description: 'Em análise.' },
  { id: 3, label: 'Aprovação', status: 'pending' },
];

describe('Timeline — render', () => {
  it('renders vertical orientation by default', () => {
    render(<Timeline steps={TIMELINE_STEPS} />);
    expect(screen.getByText('Submissão')).toBeInTheDocument();
  });

  it('renders all step labels', () => {
    render(<Timeline steps={TIMELINE_STEPS} />);
    expect(screen.getByText('Análise')).toBeInTheDocument();
    expect(screen.getByText('Aprovação')).toBeInTheDocument();
  });

  it('renders horizontal orientation', () => {
    render(<Timeline steps={TIMELINE_STEPS} orientation="horizontal" />);
    expect(screen.getByText('Submissão')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<Timeline steps={TIMELINE_STEPS} />);
    expect(screen.getByText('Em análise.')).toBeInTheDocument();
  });

  it('renders timestamp when provided', () => {
    render(<Timeline steps={TIMELINE_STEPS} />);
    expect(screen.getByText('10 Jan')).toBeInTheDocument();
  });

  it.each(['completed', 'active', 'error', 'pending'])(
    'renders status "%s" without crashing',
    (status) => {
      render(<Timeline steps={[{ id: 1, label: 'Step', status }]} />);
    },
  );
});

describe('Timeline — accessibility', () => {
  it('has no axe violations (vertical)', async () => {
    const { container } = render(<Timeline steps={TIMELINE_STEPS} orientation="vertical" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (horizontal)', async () => {
    const { container } = render(<Timeline steps={TIMELINE_STEPS} orientation="horizontal" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── DataTable ──────────────────────────────────────────────────────────────────

const COLUMNS = [
  { key: 'name', label: 'Nome' },
  { key: 'role', label: 'Função' },
];

const ROWS = [
  { id: 1, name: 'Ana Costa', role: 'Designer' },
  { id: 2, name: 'Bruno Silva', role: 'Engenheiro' },
  { id: 3, name: 'Carla Neves', role: 'Gestora' },
];

describe('DataTable — render', () => {
  it('renders column headers', () => {
    render(<DataTable rows={ROWS} columns={COLUMNS} />);
    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('Função')).toBeInTheDocument();
  });

  it('renders row data', () => {
    render(<DataTable rows={ROWS} columns={COLUMNS} />);
    expect(screen.getByText('Ana Costa')).toBeInTheDocument();
    expect(screen.getByText('Designer')).toBeInTheDocument();
  });

  it('renders empty state when rows is empty', () => {
    render(<DataTable rows={[]} columns={COLUMNS} />);
    expect(screen.getByText('Sem resultados.')).toBeInTheDocument();
  });

  it('renders pagination info', () => {
    render(<DataTable rows={ROWS} columns={COLUMNS} pageSize={2} />);
    expect(screen.getByText(/resultado/)).toBeInTheDocument();
  });

  it('renders action dropdown when onRowAction is provided', () => {
    render(<DataTable rows={ROWS} columns={COLUMNS} onRowAction={vi.fn()} />);
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });

  it('filters rows based on search', () => {
    render(<DataTable rows={ROWS} columns={COLUMNS} />);
    const search = screen.getByPlaceholderText('Pesquisar...');
    fireEvent.change(search, { target: { value: 'Ana' } });
    expect(screen.getByText('Ana Costa')).toBeInTheDocument();
    expect(screen.queryByText('Bruno Silva')).toBeNull();
  });
});

describe('DataTable — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<DataTable rows={ROWS} columns={COLUMNS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── ListView ───────────────────────────────────────────────────────────────────

const LIST_ITEMS = [
  { id: 1, name: 'Ana Costa', email: 'ana@emp.pt' },
  { id: 2, name: 'Bruno Silva', email: 'bruno@emp.pt' },
];

const LIST_COLS = [
  { key: 'name', label: 'Nome' },
  { key: 'email', label: 'Email' },
];

describe('ListView — render', () => {
  it('renders column headers', () => {
    render(<ListView items={LIST_ITEMS} columns={LIST_COLS} />);
    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders item data', () => {
    render(<ListView items={LIST_ITEMS} columns={LIST_COLS} />);
    expect(screen.getByText('Ana Costa')).toBeInTheDocument();
    expect(screen.getByText('ana@emp.pt')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<ListView items={[]} columns={LIST_COLS} />);
    expect(screen.getByText('Sem resultados.')).toBeInTheDocument();
  });

  it('renders result count', () => {
    render(<ListView items={LIST_ITEMS} columns={LIST_COLS} />);
    expect(screen.getByText('2 resultado(s)')).toBeInTheDocument();
  });

  it('filters items based on search', () => {
    render(<ListView items={LIST_ITEMS} columns={LIST_COLS} />);
    const filter = screen.getByPlaceholderText('Filtrar...');
    fireEvent.change(filter, { target: { value: 'Ana' } });
    expect(screen.getByText('Ana Costa')).toBeInTheDocument();
    expect(screen.queryByText('Bruno Silva')).toBeNull();
  });

  it('renders selection indicators when selectable', () => {
    const { container } = render(<ListView items={LIST_ITEMS} columns={LIST_COLS} selectable onSelectionChange={vi.fn()} />);
    // Custom checkbox divs are rendered (not native checkboxes)
    const rows = container.querySelectorAll('[class*="cursor-pointer"]');
    expect(rows.length).toBeGreaterThan(0);
  });
});

describe('ListView — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<ListView items={LIST_ITEMS} columns={LIST_COLS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
