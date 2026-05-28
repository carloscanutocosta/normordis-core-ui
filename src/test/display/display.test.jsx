import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import TextDisplay from '@/components/display/TextDisplay';
import BadgeDisplay from '@/components/display/BadgeDisplay';
import NumberDisplay from '@/components/display/NumberDisplay';
import DateDisplay from '@/components/display/DateDisplay';
import ProgressDisplay from '@/components/display/ProgressDisplay';
import RichTextDisplay from '@/components/display/RichTextDisplay';

expect.extend(toHaveNoViolations);

// ── TextDisplay ────────────────────────────────────────────────────────────────

describe('TextDisplay — render', () => {
  it('renders the value', () => {
    render(<TextDisplay value="Olá mundo" />);
    expect(screen.getByText('Olá mundo')).toBeInTheDocument();
  });

  it('renders em-dash placeholder when value is null', () => {
    const { container } = render(<TextDisplay value={null} />);
    expect(container.textContent).toContain('—');
  });

  it.each(['body', 'heading', 'subheading', 'caption', 'label', 'code'])(
    'renders variant "%s" without crashing',
    (variant) => {
      render(<TextDisplay value="Texto" variant={variant} />);
    },
  );
});

describe('TextDisplay — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<TextDisplay value="Texto de exemplo" variant="body" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── BadgeDisplay ───────────────────────────────────────────────────────────────

describe('BadgeDisplay — render', () => {
  it('renders the value', () => {
    render(<BadgeDisplay value="Activo" />);
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('renders nothing when value is empty', () => {
    const { container } = render(<BadgeDisplay value="" />);
    expect(container.firstChild).toBeNull();
  });

  it.each(['default', 'primary', 'success', 'warning', 'error', 'info', 'neutral'])(
    'renders color "%s" without crashing',
    (color) => {
      render(<BadgeDisplay value="Estado" color={color} />);
    },
  );
});

describe('BadgeDisplay — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<BadgeDisplay value="Aprovado" color="success" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── NumberDisplay ──────────────────────────────────────────────────────────────

describe('NumberDisplay — render', () => {
  it('renders a formatted number', () => {
    const { container } = render(<NumberDisplay value={1234.5} decimals={1} />);
    expect(container.textContent).toMatch(/1/);
  });

  it('renders em-dash when value is null', () => {
    const { container } = render(<NumberDisplay value={null} />);
    expect(container.textContent).toContain('—');
  });

  it('renders prefix and suffix', () => {
    const { container } = render(<NumberDisplay value={99} prefix="€ " suffix=" EUR" decimals={0} />);
    expect(container.textContent).toContain('€');
    expect(container.textContent).toContain('EUR');
  });

  it.each(['default', 'large', 'currency', 'compact', 'positive', 'negative'])(
    'renders variant "%s" without crashing',
    (variant) => {
      render(<NumberDisplay value={42} variant={variant} />);
    },
  );
});

describe('NumberDisplay — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<NumberDisplay value={9850} prefix="€ " decimals={2} variant="currency" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── DateDisplay ────────────────────────────────────────────────────────────────

describe('DateDisplay — render', () => {
  it('renders a formatted date', () => {
    const { container } = render(<DateDisplay value="2025-06-15" />);
    expect(container.textContent).toMatch(/2025/);
  });

  it('renders em-dash when value is null', () => {
    const { container } = render(<DateDisplay value={null} />);
    expect(container.textContent).toContain('—');
  });

  it('renders relative time when showRelative is true', () => {
    const { container } = render(
      <DateDisplay value="2025-01-01" showRelative />,
    );
    expect(container.textContent).toBeTruthy();
  });

  it('applies a custom format', () => {
    const { container } = render(
      <DateDisplay value="2025-06-15" dateFormat="yyyy" />,
    );
    expect(container.textContent).toContain('2025');
  });
});

describe('DateDisplay — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<DateDisplay value="2025-03-15" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── ProgressDisplay ────────────────────────────────────────────────────────────

describe('ProgressDisplay — render', () => {
  it('renders with a value', () => {
    render(<ProgressDisplay value={65} label="Progresso" />);
    expect(screen.getByText('Progresso')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('renders without label', () => {
    const { container } = render(<ProgressDisplay value={40} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('clamps value at 100', () => {
    render(<ProgressDisplay value={150} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('clamps value at 0', () => {
    render(<ProgressDisplay value={-10} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('hides percentage when showPercentage is false', () => {
    render(<ProgressDisplay value={60} label="CPU" showPercentage={false} />);
    expect(screen.queryByText('60%')).toBeNull();
  });
});

describe('ProgressDisplay — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<ProgressDisplay value={70} label="Carregamento" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── RichTextDisplay ────────────────────────────────────────────────────────────

describe('RichTextDisplay — render', () => {
  it('renders sanitized HTML content', () => {
    render(<RichTextDisplay value="<p>Olá <strong>mundo</strong></p>" />);
    expect(screen.getByText(/Olá/)).toBeInTheDocument();
    expect(screen.getByText(/mundo/)).toBeInTheDocument();
  });

  it('renders em-dash when value is empty', () => {
    const { container } = render(<RichTextDisplay value="" />);
    expect(container.textContent).toContain('—');
  });

  it('strips disallowed tags (XSS prevention)', () => {
    const { container } = render(
      <RichTextDisplay value='<p>Safe</p><script>alert("xss")</script>' />,
    );
    expect(container.innerHTML).not.toContain('<script>');
    expect(container.textContent).toContain('Safe');
  });
});

describe('RichTextDisplay — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <RichTextDisplay value="<p>Parágrafo de exemplo com <strong>texto a negrito</strong>.</p>" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
