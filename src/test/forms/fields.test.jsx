import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import TextField from '@/components/forms/TextField';
import SelectInput from '@/components/forms/SelectInput';

expect.extend(toHaveNoViolations);

// ── TextField ──────────────────────────────────────────────────────────────────

describe('TextField — render', () => {
  it('renders with label', () => {
    render(<TextField label="Designação" value="" onChange={vi.fn()} />);
    expect(screen.getByText('Designação')).toBeInTheDocument();
  });

  it('renders the input element', () => {
    render(<TextField label="Nome" value="" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows hint text', () => {
    render(<TextField label="Código" hint="Formato XXXX-XXX" value="" onChange={vi.fn()} />);
    expect(screen.getByText('Formato XXXX-XXX')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<TextField label="Campo" value="x" error="Valor inválido" onChange={vi.fn()} />);
    expect(screen.getByText('Valor inválido')).toBeInTheDocument();
  });

  it('renders as textarea when multiline is true', () => {
    render(<TextField label="Obs" multiline value="" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
  });

  it('renders prefix', () => {
    const { container } = render(<TextField label="Site" prefix="https://" value="" onChange={vi.fn()} />);
    expect(container.textContent).toContain('https://');
  });

  it('renders suffix', () => {
    const { container } = render(<TextField label="Email" suffix="@empresa.pt" value="" onChange={vi.fn()} />);
    expect(container.textContent).toContain('@empresa.pt');
  });

  it('shows required indicator in label', () => {
    const { container } = render(<TextField label="Nome" value="" required onChange={vi.fn()} />);
    // TextField renders a required asterisk via FieldWrapper, not native required attr
    expect(container.textContent).toContain('*');
  });

  it('marks input as readOnly', () => {
    render(<TextField label="Data" value="2025-01-01" readOnly onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(<TextField label="Nome" value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'João' } });
    expect(onChange).toHaveBeenCalled();
  });
});

describe('TextField — accessibility', () => {
  it('has no axe violations (default)', async () => {
    const { container } = render(<TextField label="Designação" value="" onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (multiline)', async () => {
    const { container } = render(<TextField label="Observações" multiline value="" onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (error state)', async () => {
    const { container } = render(<TextField label="NIF" value="abc" error="NIF inválido" onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (with prefix)', async () => {
    const { container } = render(<TextField label="Website" prefix="https://" value="" onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── SelectInput (field variant via FormField wrapper) ──────────────────────────

const ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'viewer', label: 'Observador' },
];

describe('SelectInput field — render', () => {
  it('renders with label', () => {
    render(<SelectInput label="Função" options={ROLES} value="" onChange={vi.fn()} />);
    expect(screen.getByText('Função')).toBeInTheDocument();
  });

  it('shows description', () => {
    render(<SelectInput label="Função" description="Define permissões" options={ROLES} value="" onChange={vi.fn()} />);
    expect(screen.getByText('Define permissões')).toBeInTheDocument();
  });

  it('marks field as required', () => {
    render(<SelectInput label="Tipo" options={ROLES} value="" required onChange={vi.fn()} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});

describe('SelectInput field — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<SelectInput label="Função do utilizador" options={ROLES} value="" onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
