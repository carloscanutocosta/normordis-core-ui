import { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import NormordisEditorLexical from './NormordisEditorLexical';
import { exportToNcrtf } from './serializers';

const EXPORTERS = {
  ncrtf: exportToNcrtf,
};

export default function DocumentEditor({
  className,
  exportOptions,
  formats = ['ncrtf'],
  onChange,
  onExport,
  placeholderDefinitions = [],
  semanticBlocks = [],
  value,
  ...editorProps
}) {
  const [currentValue, setCurrentValue] = useState(value ?? null);

  useEffect(() => {
    setCurrentValue(value ?? null);
  }, [value]);

  const availableFormats = useMemo(() => formats.filter((format) => EXPORTERS[format]), [formats]);

  const handleChange = useCallback(
    (nextValue) => {
      setCurrentValue(nextValue);
      onChange?.(nextValue);
    },
    [onChange],
  );

  const handleExport = useCallback(
    (format) => {
      const exporter = EXPORTERS[format];
      if (!exporter) return;

      const payload = exporter(currentValue, {
        ...(exportOptions?.[format] ?? exportOptions ?? {}),
        placeholders: placeholderDefinitions,
        semanticBlocks,
      });

      onExport?.(format, payload);
    },
    [currentValue, exportOptions, onExport, placeholderDefinitions, semanticBlocks],
  );

  return (
    <div className={cn('space-y-3', className)}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <NormordisEditorLexical
        value={value}
        onChange={handleChange}
        placeholderDefinitions={placeholderDefinitions}
        semanticBlocks={semanticBlocks}
        {...(editorProps as any)}
      />

      {onExport && availableFormats.length > 0 && (
        <div
          aria-label="Exportar documento"
          className="flex flex-wrap items-center gap-2"
          role="toolbar"
        >
          {availableFormats.map((format) => (
            <button
              key={format}
              type="button"
              onClick={() => handleExport(format)}
              className={cn(
                'inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium uppercase text-foreground transition-colors',
                'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              )}
            >
              Exportar .{format}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
