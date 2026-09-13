import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Calendar } from '@/components/ui/calendar';

// Calendar é controlado — sem estado próprio, um clique não volta a
// renderizar com o novo `selected`. Este wrapper simula o consumidor real.
function ControlledCalendar({ onSelect }) {
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

// Regressão: o react-day-picker v9+/v10 aplica aria-selected/data-selected e
// as classes de modificador (selected/today/range_*) ao <td> ("day"), não a
// um descendente — só o <button> ("day_button") é filho direto. Um seletor
// `:has([aria-selected])` no "day" nunca corresponde a nada nessa estrutura;
// estes testes fixam a estrutura real, para detectar se a lib voltar a mudar.
// Ver CHANGELOG.md e src/components/ui/calendar.tsx.
describe('Calendar — estrutura de seleção (react-day-picker v10)', () => {
  it('marca aria-selected/data-selected na célula (<td>), não no botão', () => {
    const onSelect = vi.fn();
    const { container } = render(<ControlledCalendar onSelect={onSelect} />);

    const cellNotOutside = container.querySelector(
      'td[role="gridcell"]:not([data-outside]):not([data-disabled]):not([data-hidden])',
    );
    expect(cellNotOutside).toBeTruthy();
    const dayButton = cellNotOutside.querySelector('button');
    expect(dayButton).toBeTruthy();
    fireEvent.click(dayButton);

    expect(onSelect).toHaveBeenCalledTimes(1);

    const cell = dayButton.closest('td');
    expect(cell).toHaveAttribute('aria-selected', 'true');
    expect(cell).toHaveAttribute('data-selected', 'true');
    // O botão em si nunca recebe aria-selected/data-selected diretamente.
    expect(dayButton).not.toHaveAttribute('aria-selected');

    // A classe que aplica o fundo do dia selecionado vive na célula e visa o
    // botão filho via `[&>button]`, não `:has(...)` (que não corresponderia).
    expect(cell.className).toContain('[&>button]:bg-primary');
  });

  it('aplica a classe de "hoje" à célula do dia atual', () => {
    const { container } = render(<Calendar mode="single" selected={undefined} />);
    const todayCell = container.querySelector('td[data-today="true"]');
    expect(todayCell).toBeTruthy();
    expect(todayCell.className).toContain('[&>button]:bg-accent');
  });
});
