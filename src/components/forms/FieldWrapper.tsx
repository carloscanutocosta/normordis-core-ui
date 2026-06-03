import { createContext, useContext, useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ─── Field Context ────────────────────────────────────────────────────────────

/**
 * Valores partilhados pelo FieldWrapper com os controlos de entrada filhos.
 * Os inputs consumem este contexto para injetar automaticamente atributos ARIA
 * sem que o consumidor do SDK precise de os especificar manualmente.
 */
export interface FieldContextValue {
  /** ID do campo — usado como valor de htmlFor no label e id no input. */
  id: string;
  /** Indica se o campo está em estado de erro (usado em aria-invalid). */
  invalid: boolean;
  /** ID(s) para aria-describedby — aponta para hint e/ou error. */
  describedBy: string | undefined;
  /** Indica se o campo é obrigatório (usado em aria-required / required). */
  required: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * Devolve o contexto do FieldWrapper pai, se existir.
 * Retorna null quando chamado fora de um FieldWrapper — sem crash.
 *
 * @example
 * const field = useFieldContext();
 * <input
 *   aria-invalid={field?.invalid || undefined}
 *   aria-describedby={field?.describedBy}
 *   aria-required={field?.required || undefined}
 * />
 */
export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}

// ─── Component ────────────────────────────────────────────────────────────────

interface FieldWrapperProps {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children?: ReactNode;
  className?: string;
}

export default function FieldWrapper({
  id: idProp,
  label,
  hint,
  error,
  required,
  children,
  className,
}: FieldWrapperProps) {
  const autoId = useId();
  const id = idProp ?? autoId;

  // IDs estáveis e únicos para as mensagens de hint e erro.
  // O aria-describedby do input aponta para estes IDs.
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  // O erro tem precedência sobre o hint em aria-describedby.
  // Se ambos existirem (hint + error), o error substitui o hint
  // porque os dois nunca são renderizados ao mesmo tempo (ver JSX abaixo).
  const describedBy = errorId ?? hintId;

  const ctxValue: FieldContextValue = {
    id,
    invalid: !!error,
    describedBy,
    required: !!required,
  };

  return (
    <FieldContext.Provider value={ctxValue}>
      <div className={cn('flex flex-col gap-1.5', className)}>
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-foreground leading-none">
            {label}
            {required && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}
          </label>
        )}
        {children}
        {hint && !error && (
          <p id={hintId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
        {error && (
          // role="alert" garante que o leitor de ecrã anuncia o erro
          // imediatamente quando aparece, sem necessidade de foco no elemento.
          <p id={errorId} role="alert" className="text-xs text-destructive font-medium">
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
}
