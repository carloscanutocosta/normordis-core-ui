import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Calendar } from '@/components/ui/calendar';

// Calendar é controlado — sem estado próprio, um clique não volta a
// renderizar com o novo `selected`. Este wrapper simula o consumidor real.
function ControlledSingleCalendar({ onSelect }) {
  const [selected, setSelected] = useState(undefined);
  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={(date) => {
        setSelected(date);
        onSelect(date);
      }}
    />
  );
}

function ControlledRangeCalendar({ defaultMonth }) {
  const [range, setRange] = useState(undefined);
  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      defaultMonth={defaultMonth}
      showOutsideDays={false}
    />
  );
}

function dayButtonsInVisibleMonth(container) {
  return Array.from(
    container.querySelectorAll(
      'td[role="gridcell"]:not([data-outside]):not([data-disabled]):not([data-hidden]) button',
    ),
  );
}

// Regressão: o react-day-picker aplica aria-selected ao <td> ("day"), não ao
// <button> ("day_button") — só o botão é filho direto da célula. Um seletor
// `:has([aria-selected])` no "day" (versão anterior deste ficheiro) nunca
// corresponde a nada nessa estrutura.
//
// A cor de fundo (selected/today/range_*) é decidida em CalendarDayButton em
// JavaScript, não em CSS: o react-day-picker marca cada dia do meio de um
// intervalo como `selected` E `range_middle` simultaneamente, e duas classes
// CSS com a mesma especificidade no mesmo elemento dependeriam da ordem de
// emissão do Tailwind, não da intenção do código (achado do Codex no PR #33,
// só visível com uma seleção de intervalo multi-dia real).
//
// Usamos apenas `aria-selected` (não `data-selected`/`data-today`): estes
// `data-*` por-dia só existem a partir de uma versão posterior ao mínimo
// `>=9.0.0` anunciado em peerDependencies — confirmado testando contra esse
// mínimo exato, onde `getDataAttributes` (v9.0.0) não os inclui. `aria-*` e
// as classes de modificador são as únicas garantias estáveis entre versões.
// Ver CHANGELOG.md e src/components/ui/calendar.tsx.
describe('Calendar — estrutura de seleção (react-day-picker)', () => {
  it('seleção única: marca aria-selected na célula e bg-primary no botão', () => {
    const onSelect = vi.fn();
    const { container } = render(<ControlledSingleCalendar onSelect={onSelect} />);

    const [dayButton] = dayButtonsInVisibleMonth(container);
    expect(dayButton).toBeTruthy();
    fireEvent.click(dayButton);

    expect(onSelect).toHaveBeenCalledTimes(1);

    const cell = dayButton.closest('td');
    expect(cell).toHaveAttribute('aria-selected', 'true');
    // O botão em si nunca recebe aria-selected diretamente.
    expect(dayButton).not.toHaveAttribute('aria-selected');
    expect(dayButton.className).toContain('bg-primary');
    expect(dayButton.className).not.toContain('bg-accent');
  });

  it('aplica bg-accent a exatamente um botão do mês (o dia de hoje)', () => {
    const { container } = render(<Calendar mode="single" selected={undefined} />);
    // A variante "ghost" do Button já traz `hover:bg-accent`; procuramos a
    // classe exata `bg-accent` (aplicada sem estado), não a substring.
    const highlighted = dayButtonsInVisibleMonth(container).filter((btn) =>
      btn.className.split(' ').includes('bg-accent'),
    );
    expect(highlighted).toHaveLength(1);
  });

  it('intervalo multi-dia: dias do meio ficam bg-accent, não bg-primary, mesmo sendo "selected"', () => {
    // Intervalo fixo dentro de um mês conhecido, sem depender da data atual.
    const defaultMonth = new Date(2026, 8, 1); // setembro de 2026
    const { container } = render(<ControlledRangeCalendar defaultMonth={defaultMonth} />);

    const buttons = dayButtonsInVisibleMonth(container);
    const findByDay = (day) => buttons.find((btn) => btn.textContent.trim() === String(day));

    // Seleciona o intervalo 5–9 de setembro de 2026 (clique de início + fim,
    // como um utilizador real faria em mode="range").
    fireEvent.click(findByDay(5));
    fireEvent.click(findByDay(9));

    // Os dias do meio (6, 7, 8) são simultaneamente "selected" e
    // "range_middle" — têm de mostrar a cor de intervalo (accent), não a de
    // seleção única (primary), que fica reservada às pontas (5 e 9).
    for (const day of [6, 7, 8]) {
      const btn = findByDay(day);
      expect(btn.className).toContain('bg-accent');
      expect(btn.className).not.toContain('bg-primary');
    }
    for (const day of [5, 9]) {
      const btn = findByDay(day);
      expect(btn.className).toContain('bg-primary');
    }
  });
});
