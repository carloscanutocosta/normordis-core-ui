import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import TextInput from '@/components/forms/TextInput';
import NumberInput from '@/components/forms/NumberInput';
import SelectInput from '@/components/forms/SelectInput';
import SliderInput from '@/components/forms/SliderInput';
import SwitchInput from '@/components/forms/SwitchInput';
import CheckboxInput from '@/components/forms/CheckboxInput';
import RatingInput from '@/components/forms/RatingInput';
import TagsInput from '@/components/forms/TagsInput';
import PasswordInput from '@/components/forms/PasswordInput';
import MultiSelectInput from '@/components/forms/MultiSelectInput';
import SearchInput from '@/components/forms/SearchInput';
import OTPInput from '@/components/forms/OTPInput';

expect.extend(toHaveNoViolations);

const OPTIONS = [
  { value: 'a', label: 'Opção A' },
  { value: 'b', label: 'Opção B' },
  { value: 'c', label: 'Opção C' },
];

// ── TextInput ──────────────────────────────────────────────────────────────────

describe('TextInput — render', () => {
  it('renders with label', () => {
    render(<TextInput label="Nome" value="" onChange={vi.fn()} />);
    expect(screen.getByText('Nome')).toBeInTheDocument();
  });

  it('renders the input element', () => {
    render(<TextInput label="Nome" value="" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<TextInput label="Email" value="" error="Email inválido" onChange={vi.fn()} />);
    expect(screen.getByText('Email inválido')).toBeInTheDocument();
  });

  it('disables input when disabled', () => {
    render(<TextInput label="Campo" value="x" disabled onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(<TextInput label="Nome" value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'João' } });
    expect(onChange).toHaveBeenCalledWith('João');
  });
});

describe('TextInput — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<TextInput label="Nome completo" value="" onChange={vi.fn()} required />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations in error state', async () => {
    const { container } = render(<TextInput label="Email" value="x" error="Inválido" onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── NumberInput ────────────────────────────────────────────────────────────────

describe('NumberInput — render', () => {
  it('renders with label', () => {
    render(<NumberInput label="Quantidade" value={0} onChange={vi.fn()} />);
    expect(screen.getByText('Quantidade')).toBeInTheDocument();
  });

  it('renders stepper buttons when showStepper is true', () => {
    render(<NumberInput label="Stock" value={5} showStepper onChange={vi.fn()} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('increment button calls onChange with incremented value', () => {
    const onChange = vi.fn();
    render(<NumberInput label="N" value={5} showStepper step={1} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it('decrement button calls onChange with decremented value', () => {
    const onChange = vi.fn();
    render(<NumberInput label="N" value={5} showStepper step={1} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('renders prefix and suffix', () => {
    const { container } = render(<NumberInput label="Valor" value={10} prefix="€" suffix="EUR" onChange={vi.fn()} />);
    expect(container.textContent).toContain('€');
    expect(container.textContent).toContain('EUR');
  });
});

describe('NumberInput — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<NumberInput label="Quantidade" value={10} onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── SelectInput ────────────────────────────────────────────────────────────────

describe('SelectInput — render', () => {
  it('renders with label', () => {
    render(<SelectInput label="Função" options={OPTIONS} value="" onChange={vi.fn()} />);
    expect(screen.getByText('Função')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<SelectInput label="Tipo" options={OPTIONS} value="" error="Obrigatório" onChange={vi.fn()} />);
    expect(screen.getByText('Obrigatório')).toBeInTheDocument();
  });

  it('renders string options', () => {
    render(<SelectInput label="País" options={['Portugal', 'Brasil']} value="" onChange={vi.fn()} />);
    expect(screen.getByText('País')).toBeInTheDocument();
  });
});

describe('SelectInput — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<SelectInput label="Função" options={OPTIONS} value="" onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── SliderInput ────────────────────────────────────────────────────────────────

describe('SliderInput — render', () => {
  it('renders with label', () => {
    render(<SliderInput label="Volume" value={50} onChange={vi.fn()} />);
    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  it('shows current value', () => {
    render(<SliderInput label="Volume" value={75} onChange={vi.fn()} />);
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('renders with suffix', () => {
    render(<SliderInput label="Desconto" value={20} suffix="%" onChange={vi.fn()} />);
    const percentages = screen.getAllByText(/\d+%/);
    expect(percentages.length).toBeGreaterThan(0);
  });

  it('hides value display when showValue is false', () => {
    render(<SliderInput value={50} showValue={false} onChange={vi.fn()} />);
    expect(screen.queryByText('50')).toBeNull();
  });
});

describe('SliderInput — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<SliderInput label="Volume" value={50} onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── SwitchInput ────────────────────────────────────────────────────────────────

describe('SwitchInput — render', () => {
  it('renders with label', () => {
    render(<SwitchInput label="Notificações" checked={false} onChange={vi.fn()} />);
    expect(screen.getByText('Notificações')).toBeInTheDocument();
  });

  it('renders the switch element', () => {
    render(<SwitchInput label="Activo" checked={false} onChange={vi.fn()} />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('reflects checked state', () => {
    render(<SwitchInput label="Activo" checked={true} onChange={vi.fn()} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('shows description when provided', () => {
    render(<SwitchInput label="Tema" description="Modo escuro" checked={false} onChange={vi.fn()} />);
    expect(screen.getByText('Modo escuro')).toBeInTheDocument();
  });
});

describe('SwitchInput — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<SwitchInput label="Notificações activas" checked={false} onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── CheckboxInput ──────────────────────────────────────────────────────────────

describe('CheckboxInput — render', () => {
  it('renders with label', () => {
    render(<CheckboxInput label="Aceito os termos" checked={false} onChange={vi.fn()} />);
    expect(screen.getByText('Aceito os termos')).toBeInTheDocument();
  });

  it('renders the checkbox element', () => {
    render(<CheckboxInput label="Aceito" checked={false} onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('reflects checked state', () => {
    render(<CheckboxInput label="Aceito" checked={true} onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('disables the checkbox', () => {
    render(<CheckboxInput label="Indisponível" checked={false} disabled onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});

describe('CheckboxInput — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<CheckboxInput label="Aceito os termos e condições" checked={false} onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── RatingInput ────────────────────────────────────────────────────────────────

describe('RatingInput — render', () => {
  it('renders with label', () => {
    render(<RatingInput label="Avaliação" value={0} onChange={vi.fn()} />);
    expect(screen.getByText('Avaliação')).toBeInTheDocument();
  });

  it('renders the correct number of star buttons', () => {
    render(<RatingInput label="Nota" value={0} max={5} onChange={vi.fn()} />);
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });

  it('shows value/max when value > 0', () => {
    render(<RatingInput label="Nota" value={3} max={5} onChange={vi.fn()} />);
    expect(screen.getByText('3/5')).toBeInTheDocument();
  });

  it('calls onChange when a star is clicked', () => {
    const onChange = vi.fn();
    render(<RatingInput label="Nota" value={0} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole('radio')[2]);
    expect(onChange).toHaveBeenCalledWith(3);
  });
});

describe('RatingInput — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<RatingInput label="Avaliação do serviço" value={3} onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── TagsInput ──────────────────────────────────────────────────────────────────

describe('TagsInput — render', () => {
  it('renders with label', () => {
    render(<TagsInput label="Etiquetas" value={[]} onChange={vi.fn()} />);
    expect(screen.getByText('Etiquetas')).toBeInTheDocument();
  });

  it('renders existing tags', () => {
    render(<TagsInput label="Tags" value={['urgente', 'revisão']} onChange={vi.fn()} />);
    expect(screen.getByText('urgente')).toBeInTheDocument();
    expect(screen.getByText('revisão')).toBeInTheDocument();
  });

  it('adds tag on Enter', () => {
    const onChange = vi.fn();
    render(<TagsInput label="Tags" value={[]} onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'nova' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(['nova']);
  });

  it('does not add duplicate tags', () => {
    const onChange = vi.fn();
    render(<TagsInput label="Tags" value={['existente']} onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'existente' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('TagsInput — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<TagsInput label="Etiquetas do processo" value={['draft']} onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── PasswordInput ──────────────────────────────────────────────────────────────

describe('PasswordInput — render', () => {
  it('renders with label', () => {
    render(<PasswordInput label="Palavra-passe" value="" onChange={vi.fn()} />);
    expect(screen.getByText('Palavra-passe')).toBeInTheDocument();
  });

  it('renders as password type by default', () => {
    render(<PasswordInput label="PW" value="secret" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('secret').type).toBe('password');
  });

  it('toggles to text type when visibility button is clicked', () => {
    render(<PasswordInput label="PW" value="secret" onChange={vi.fn()} />);
    const toggle = screen.getByRole('button');
    fireEvent.click(toggle);
    expect(screen.getByDisplayValue('secret').type).toBe('text');
  });

  it('shows error message', () => {
    render(<PasswordInput label="PW" value="" error="Mínimo 8 chars" onChange={vi.fn()} />);
    expect(screen.getByText('Mínimo 8 chars')).toBeInTheDocument();
  });
});

describe('PasswordInput — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<PasswordInput label="Palavra-passe" value="" onChange={vi.fn()} required />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── MultiSelectInput ───────────────────────────────────────────────────────────

describe('MultiSelectInput — render', () => {
  it('renders with label', () => {
    render(<MultiSelectInput label="Permissões" options={OPTIONS} value={[]} onChange={vi.fn()} />);
    expect(screen.getByText('Permissões')).toBeInTheDocument();
  });

  it('renders selected values as badges', () => {
    render(<MultiSelectInput label="Tags" options={OPTIONS} value={['a', 'b']} onChange={vi.fn()} />);
    expect(screen.getByText('Opção A')).toBeInTheDocument();
    expect(screen.getByText('Opção B')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<MultiSelectInput label="Cats" options={OPTIONS} value={[]} error="Obrigatório" onChange={vi.fn()} />);
    expect(screen.getByText('Obrigatório')).toBeInTheDocument();
  });
});

describe('MultiSelectInput — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<MultiSelectInput label="Categorias" options={OPTIONS} value={[]} onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── SearchInput ────────────────────────────────────────────────────────────────

describe('SearchInput — render', () => {
  it('renders the input', () => {
    render(<SearchInput value="" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows clear button when value is set', () => {
    render(<SearchInput value="teste" onChange={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('hides clear button when value is empty', () => {
    render(<SearchInput value="" onChange={vi.fn()} />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('calls onChange with empty string when clear is clicked', () => {
    const onChange = vi.fn();
    render(<SearchInput value="texto" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onChange).toHaveBeenCalledWith('');
  });
});

describe('SearchInput — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<SearchInput value="" onChange={vi.fn()} placeholder="Pesquisar..." />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── OTPInput ───────────────────────────────────────────────────────────────────

describe('OTPInput — render', () => {
  it('renders the correct number of input boxes', () => {
    render(<OTPInput label="Código" value="" onChange={vi.fn()} length={6} />);
    const inputs = document.querySelectorAll('input[maxlength="1"]');
    expect(inputs).toHaveLength(6);
  });

  it('renders label', () => {
    render(<OTPInput label="PIN" value="" onChange={vi.fn()} length={4} />);
    expect(screen.getByText('PIN')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<OTPInput label="OTP" value="" error="Código inválido" onChange={vi.fn()} />);
    expect(screen.getByText('Código inválido')).toBeInTheDocument();
  });
});

describe('OTPInput — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<OTPInput label="Código de verificação" value="" onChange={vi.fn()} length={6} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
