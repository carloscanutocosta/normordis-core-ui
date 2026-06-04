import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import FieldWrapper from '@/components/forms/FieldWrapper';
import CheckboxField from '@/components/forms/CheckboxField';
import RadioField from '@/components/forms/RadioField';
import SwitchField from '@/components/forms/SwitchField';
import SliderField from '@/components/forms/SliderField';
import NumberField from '@/components/forms/NumberField';
import SelectField from '@/components/forms/SelectField';

expect.extend(toHaveNoViolations);

// ── FieldWrapper — FieldContext ────────────────────────────────────────────────

describe('FieldWrapper — FieldContext ARIA', () => {
  it('associates label with input via htmlFor/id', () => {
    render(
      <FieldWrapper id="test-name" label="Nome">
        <input id="test-name" />
      </FieldWrapper>,
    );
    const label = screen.getByText('Nome');
    expect(label).toHaveAttribute('for', 'test-name');
  });

  it('renders error with role="alert"', () => {
    render(<FieldWrapper label="Campo" error="Obrigatório" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Obrigatório');
  });

  it('does not render alert when there is no error', () => {
    render(<FieldWrapper label="Campo" hint="Ajuda" />);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('renders hint without role="alert"', () => {
    render(<FieldWrapper label="Campo" hint="Formato correto" />);
    expect(screen.getByText('Formato correto')).not.toHaveAttribute('role', 'alert');
  });

  it('renders required indicator and hides it from screen readers', () => {
    const { container } = render(<FieldWrapper label="Campo" required />);
    const asterisk = container.querySelector('[aria-hidden="true"]');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveTextContent('*');
  });

  it('does not render hint when error is present', () => {
    render(<FieldWrapper label="Campo" hint="Ajuda" error="Inválido" />);
    expect(screen.queryByText('Ajuda')).toBeNull();
    expect(screen.getByText('Inválido')).toBeInTheDocument();
  });

  it('has no axe violations (default)', async () => {
    const { container } = render(
      <FieldWrapper id="fw-default" label="Campo">
        <input id="fw-default" />
      </FieldWrapper>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (error state)', async () => {
    const { container } = render(
      <FieldWrapper id="fw-error" label="Campo" error="Obrigatório">
        <input id="fw-error" aria-describedby="fw-error-error" aria-invalid="true" />
      </FieldWrapper>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (hint state)', async () => {
    const { container } = render(
      <FieldWrapper id="fw-hint" label="Campo" hint="Ajuda">
        <input id="fw-hint" aria-describedby="fw-hint-hint" />
      </FieldWrapper>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── NumberField ────────────────────────────────────────────────────────────────

describe('NumberField — FieldContext ARIA', () => {
  it('injects aria-invalid when error is set', () => {
    render(<NumberField label="Quantidade" value={0} error="Valor negativo" onChange={vi.fn()} />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-invalid', 'true');
  });

  it('injects aria-describedby pointing to error element', () => {
    render(<NumberField label="Quantidade" value={0} error="Valor negativo" onChange={vi.fn()} />);
    const input = screen.getByRole('spinbutton');
    const describedById = input.getAttribute('aria-describedby');
    expect(describedById).toBeTruthy();
    expect(document.getElementById(describedById)).toHaveTextContent('Valor negativo');
  });

  it('injects aria-required when required is set', () => {
    render(<NumberField label="Quantidade" value={0} required onChange={vi.fn()} />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-required', 'true');
  });

  it('does not set aria-invalid when there is no error', () => {
    render(<NumberField label="Quantidade" value={0} onChange={vi.fn()} />);
    expect(screen.getByRole('spinbutton')).not.toHaveAttribute('aria-invalid');
  });

  it('has no axe violations (default)', async () => {
    const { container } = render(
      <NumberField label="Quantidade de itens" value={0} onChange={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (error state)', async () => {
    const { container } = render(
      <NumberField label="Quantidade" value={-1} error="Deve ser positivo" onChange={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── SelectField ────────────────────────────────────────────────────────────────

const OPCOES = [
  { value: 'a', label: 'Opção A' },
  { value: 'b', label: 'Opção B' },
];

describe('SelectField — FieldContext ARIA', () => {
  it('has no axe violations (default)', async () => {
    const { container } = render(
      <SelectField label="Categoria" options={OPCOES} value="" onChange={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (error state)', async () => {
    const { container } = render(
      <SelectField
        label="Categoria"
        options={OPCOES}
        value=""
        error="Selecione uma opção"
        onChange={vi.fn()}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows error message', () => {
    render(
      <SelectField
        label="Categoria"
        options={OPCOES}
        value=""
        error="Campo obrigatório"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Campo obrigatório');
  });
});

// ── CheckboxField ──────────────────────────────────────────────────────────────

describe('CheckboxField — render', () => {
  it('renders checkbox role', () => {
    render(<CheckboxField checkLabel="Aceito os termos" value={false} onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders label text', () => {
    render(
      <CheckboxField label="Termos" checkLabel="Li e aceito" value={false} onChange={vi.fn()} />,
    );
    expect(screen.getByText('Termos')).toBeInTheDocument();
    expect(screen.getByText('Li e aceito')).toBeInTheDocument();
  });

  it('renders in checked state', () => {
    render(<CheckboxField checkLabel="Aceito" value={true} onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked');
  });

  it('renders in unchecked state', () => {
    render(<CheckboxField checkLabel="Aceito" value={false} onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'unchecked');
  });

  it('shows error message', () => {
    render(
      <CheckboxField
        checkLabel="Aceito"
        value={false}
        error="Campo obrigatório"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Campo obrigatório');
  });

  it('shows required indicator when required', () => {
    const { container } = render(
      <CheckboxField
        label="Termos"
        checkLabel="Aceito"
        value={false}
        required
        onChange={vi.fn()}
      />,
    );
    expect(container.textContent).toContain('*');
  });
});

describe('CheckboxField — FieldContext ARIA', () => {
  it('injects aria-invalid when error is set', () => {
    render(
      <CheckboxField checkLabel="Aceito" value={false} error="Obrigatório" onChange={vi.fn()} />,
    );
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('injects aria-describedby pointing to error element', () => {
    render(
      <CheckboxField checkLabel="Aceito" value={false} error="Obrigatório" onChange={vi.fn()} />,
    );
    const cb = screen.getByRole('checkbox');
    const describedById = cb.getAttribute('aria-describedby');
    expect(describedById).toBeTruthy();
    expect(document.getElementById(describedById)).toHaveTextContent('Obrigatório');
  });

  it('injects aria-required when required', () => {
    render(<CheckboxField checkLabel="Aceito" value={false} required onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-required', 'true');
  });

  it('does not set aria-invalid without error', () => {
    render(<CheckboxField checkLabel="Aceito" value={false} onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid');
  });

  it('has no axe violations (default)', async () => {
    const { container } = render(
      <CheckboxField
        label="Aceito os termos"
        checkLabel="Li e aceito"
        value={false}
        onChange={vi.fn()}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (error state)', async () => {
    const { container } = render(
      <CheckboxField
        label="Aceito os termos"
        checkLabel="Li e aceito"
        value={false}
        error="É obrigatório aceitar"
        onChange={vi.fn()}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── RadioField ─────────────────────────────────────────────────────────────────

const OPCOES_RADIO = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
];

describe('RadioField — render', () => {
  it('renders radiogroup role', () => {
    render(<RadioField label="Resposta" options={OPCOES_RADIO} value="" onChange={vi.fn()} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('renders all radio options', () => {
    render(<RadioField label="Resposta" options={OPCOES_RADIO} value="" onChange={vi.fn()} />);
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('marks the selected option', () => {
    render(<RadioField label="Resposta" options={OPCOES_RADIO} value="sim" onChange={vi.fn()} />);
    const checked = screen
      .getAllByRole('radio')
      .find((r) => r.getAttribute('data-state') === 'checked');
    expect(checked).toBeInTheDocument();
  });

  it('renders string options', () => {
    render(<RadioField label="Cor" options={['Azul', 'Verde']} value="" onChange={vi.fn()} />);
    expect(screen.getByText('Azul')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(
      <RadioField
        label="Resposta"
        options={OPCOES_RADIO}
        value=""
        error="Escolha uma opção"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Escolha uma opção');
  });
});

describe('RadioField — FieldContext ARIA', () => {
  it('injects aria-invalid on radiogroup when error is set', () => {
    render(
      <RadioField
        label="Resposta"
        options={OPCOES_RADIO}
        value=""
        error="Obrigatório"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
  });

  it('injects aria-describedby pointing to error element', () => {
    render(
      <RadioField
        label="Resposta"
        options={OPCOES_RADIO}
        value=""
        error="Obrigatório"
        onChange={vi.fn()}
      />,
    );
    const group = screen.getByRole('radiogroup');
    const describedById = group.getAttribute('aria-describedby');
    expect(describedById).toBeTruthy();
    expect(document.getElementById(describedById)).toHaveTextContent('Obrigatório');
  });

  it('injects aria-required on radiogroup when required', () => {
    render(
      <RadioField label="Resposta" options={OPCOES_RADIO} value="" required onChange={vi.fn()} />,
    );
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true');
  });

  it('does not set aria-invalid without error', () => {
    render(<RadioField label="Resposta" options={OPCOES_RADIO} value="" onChange={vi.fn()} />);
    expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-invalid');
  });

  it('has no axe violations (default)', async () => {
    const { container } = render(
      <RadioField label="Confirmação" options={OPCOES_RADIO} value="" onChange={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (error state)', async () => {
    const { container } = render(
      <RadioField
        label="Confirmação"
        options={OPCOES_RADIO}
        value=""
        error="Selecione uma opção"
        onChange={vi.fn()}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── SwitchField ────────────────────────────────────────────────────────────────

describe('SwitchField — render', () => {
  it('renders switch role', () => {
    render(<SwitchField label="Notificações" value={false} onChange={vi.fn()} />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('renders label', () => {
    render(<SwitchField label="Notificações ativas" value={false} onChange={vi.fn()} />);
    expect(screen.getByText('Notificações ativas')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <SwitchField
        label="Notificações"
        description="Receba alertas por email"
        value={false}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Receba alertas por email')).toBeInTheDocument();
  });

  it('reflects checked state', () => {
    render(<SwitchField label="Ativo" value={true} onChange={vi.fn()} />);
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'checked');
  });

  it('reflects unchecked state', () => {
    render(<SwitchField label="Ativo" value={false} onChange={vi.fn()} />);
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'unchecked');
  });

  it('shows error message', () => {
    render(<SwitchField label="Ativo" value={false} error="Obrigatório" onChange={vi.fn()} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Obrigatório');
  });
});

describe('SwitchField — FieldContext ARIA', () => {
  it('injects aria-invalid when error is set', () => {
    render(<SwitchField label="Ativo" value={false} error="Obrigatório" onChange={vi.fn()} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true');
  });

  it('injects aria-describedby pointing to error element', () => {
    render(<SwitchField label="Ativo" value={false} error="Obrigatório" onChange={vi.fn()} />);
    const sw = screen.getByRole('switch');
    const describedById = sw.getAttribute('aria-describedby');
    expect(describedById).toBeTruthy();
    expect(document.getElementById(describedById)).toHaveTextContent('Obrigatório');
  });

  it('does not set aria-invalid without error', () => {
    render(<SwitchField label="Ativo" value={false} onChange={vi.fn()} />);
    expect(screen.getByRole('switch')).not.toHaveAttribute('aria-invalid');
  });

  it('has no axe violations (default)', async () => {
    const { container } = render(
      <SwitchField label="Receber notificações" value={false} onChange={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (error state)', async () => {
    const { container } = render(
      <SwitchField
        label="Receber notificações"
        value={false}
        error="Obrigatório"
        onChange={vi.fn()}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── SliderField ────────────────────────────────────────────────────────────────

describe('SliderField — render', () => {
  it('renders slider role', () => {
    render(<SliderField label="Volume" value={50} onChange={vi.fn()} />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('renders label', () => {
    render(<SliderField label="Intensidade" value={30} onChange={vi.fn()} />);
    expect(screen.getByText('Intensidade')).toBeInTheDocument();
  });

  it('shows current value when showValue is true', () => {
    render(<SliderField label="Volume" value={75} onChange={vi.fn()} showValue />);
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('hides value display when showValue is false', () => {
    render(<SliderField label="Volume" value={75} onChange={vi.fn()} showValue={false} />);
    // The value text is not rendered
    expect(screen.queryByText('75')).toBeNull();
  });

  it('renders min and max labels', () => {
    render(<SliderField label="Volume" value={50} min={0} max={100} onChange={vi.fn()} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<SliderField label="Volume" value={50} error="Fora do intervalo" onChange={vi.fn()} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Fora do intervalo');
  });

  it('applies custom formatValue', () => {
    render(
      <SliderField label="Volume" value={50} formatValue={(v) => `${v}%`} onChange={vi.fn()} />,
    );
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});

describe('SliderField — FieldContext ARIA', () => {
  it('injects aria-describedby on slider when error is set', () => {
    render(<SliderField label="Volume" value={50} error="Fora do intervalo" onChange={vi.fn()} />);
    const slider = screen.getByRole('slider');
    const describedById = slider.getAttribute('aria-describedby');
    expect(describedById).toBeTruthy();
    expect(document.getElementById(describedById)).toHaveTextContent('Fora do intervalo');
  });

  it('has no axe violations (default)', async () => {
    const { container } = render(
      <SliderField label="Nível de ruído" value={40} min={0} max={100} onChange={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (error state)', async () => {
    const { container } = render(
      <SliderField
        label="Nível de ruído"
        value={40}
        min={0}
        max={100}
        error="Valor fora do intervalo"
        onChange={vi.fn()}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
