import React, { useState, useRef, useEffect } from 'react';
import { X, FileDown, Loader2, Trash2, LayoutTemplate, BarChart2, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ── Template previews ──────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'corporate',
    label: 'Corporativo',
    description: 'Header colorido, tabela zebrada, rodapé com paginação',
    preview: (
      <div className="w-full h-full bg-white rounded overflow-hidden text-[4px] font-mono">
        <div className="bg-indigo-600 h-3 w-full flex items-center px-1">
          <span className="text-white font-bold">Empresa</span>
          <span className="text-white/70 ml-auto">Relatório</span>
        </div>
        <div className="bg-gray-100 h-1.5 w-full" />
        <div className="px-1 pt-0.5 space-y-0.5">
          <div className="bg-indigo-600 h-1.5 w-full rounded-sm" />
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn('h-1 w-full rounded-sm', i % 2 === 0 ? 'bg-gray-50' : 'bg-white')}
            />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gray-100 h-1.5" />
      </div>
    ),
  },
  {
    id: 'minimal',
    label: 'Minimalista',
    description: 'Fundo branco limpo, linha de separação discreta',
    preview: (
      <div className="w-full h-full bg-white rounded overflow-hidden text-[4px]">
        <div className="border-b-2 border-gray-800 mx-1 mt-1 flex items-end pb-0.5">
          <span className="text-[5px] font-bold text-gray-800">RELATÓRIO</span>
          <span className="text-gray-400 ml-auto text-[4px]">2026</span>
        </div>
        <div className="px-1 pt-1 space-y-0.5">
          <div className="border-b border-gray-200 h-1.5 w-full" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-b border-gray-100 h-1 w-full" />
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'dark',
    label: 'Escuro',
    description: 'Header e tabela em tema escuro, texto claro',
    preview: (
      <div className="w-full h-full bg-gray-900 rounded overflow-hidden">
        <div className="bg-gray-800 h-3 w-full flex items-center px-1">
          <span className="text-[4px] text-white font-bold">Empresa</span>
          <span className="text-[4px] text-gray-400 ml-auto">Relatório</span>
        </div>
        <div className="bg-gray-700 h-1 w-full" />
        <div className="px-1 pt-0.5 space-y-0.5">
          <div className="bg-indigo-500 h-1.5 w-full rounded-sm" />
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn('h-1 w-full rounded-sm', i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750')}
            />
          ))}
        </div>
      </div>
    ),
  },
];

// ── Inline SignaturePad (sem FormField wrapper) ────────────────────────────
function InlineSignaturePad({ value, onChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [isEmpty, setIsEmpty] = useState(!value);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#1e1e32';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
    setIsEmpty(false);
  };

  const stop = () => {
    if (!drawing.current) return;
    drawing.current = false;
    onChange?.(canvasRef.current.toDataURL());
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onChange?.('');
  };

  return (
    <div className="rounded-md border border-input overflow-hidden">
      <canvas
        ref={canvasRef}
        width={500}
        height={100}
        className="w-full bg-background cursor-crosshair touch-none"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={stop}
      />
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-border bg-muted/30">
        <span className="text-xs text-muted-foreground">
          {isEmpty ? 'Assine acima' : 'Assinatura capturada ✓'}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clear}
          disabled={isEmpty}
          className="h-6 text-xs gap-1 text-muted-foreground"
        >
          <Trash2 className="h-3 w-3" /> Limpar
        </Button>
      </div>
    </div>
  );
}

// ── Mini bar chart builder (pure canvas) ──────────────────────────────────
export function buildChartImage(rows, columns) {
  // Find a numeric column for chart summary
  const numericCols = columns.filter((col) => {
    return rows.some((r) => !isNaN(parseFloat(r[col.key])));
  });
  if (numericCols.length === 0 || rows.length === 0) return null;

  const col = numericCols[0];
  // Group/aggregate: take first text column as label, sum numeric col
  const labelCol = columns.find((c) => c.key !== col.key);
  const MAX_BARS = 8;

  // Build label→value map, truncated
  const entries = rows.slice(0, MAX_BARS).map((r) => ({
    label: String(r[labelCol?.key] ?? '').slice(0, 12),
    value: parseFloat(r[col.key]) || 0,
  }));

  const W = 500,
    H = 180;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  const maxVal = Math.max(...entries.map((e) => e.value), 1);
  const padL = 40,
    padR = 10,
    padT = 20,
    padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const barW = (chartW / entries.length) * 0.6;
  const gap = chartW / entries.length;

  // Grid lines
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 0.5;
  [0.25, 0.5, 0.75, 1].forEach((frac) => {
    const y = padT + chartH * (1 - frac);
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(W - padR, y);
    ctx.stroke();
    ctx.fillStyle = '#9ca3af';
    ctx.font = '10px helvetica';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxVal * frac), padL - 4, y + 3);
  });

  // Bars
  const COLORS = [
    '#4338ca',
    '#059669',
    '#d97706',
    '#dc2626',
    '#7c3aed',
    '#0891b2',
    '#be185d',
    '#b45309',
  ];
  entries.forEach(({ label, value }, i) => {
    const x = padL + i * gap + (gap - barW) / 2;
    const barH = (value / maxVal) * chartH;
    const y = padT + chartH - barH;

    ctx.fillStyle = COLORS[i % COLORS.length];
    // Rounded top
    const r = 3;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + barW - r, y);
    ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
    ctx.lineTo(x + barW, padT + chartH);
    ctx.lineTo(x, padT + chartH);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();

    // Value label on top
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 9px helvetica';
    ctx.textAlign = 'center';
    ctx.fillText(String(value), x + barW / 2, y - 3);

    // X label
    ctx.fillStyle = '#6b7280';
    ctx.font = '8px helvetica';
    ctx.fillText(label, x + barW / 2, H - padB + 12);
  });

  // Column title
  ctx.fillStyle = '#374151';
  ctx.font = 'bold 11px helvetica';
  ctx.textAlign = 'left';
  ctx.fillText(`Resumo: ${col.label}`, padL, padT - 6);

  return canvas.toDataURL('image/png');
}

// ── PDF generation engines ─────────────────────────────────────────────────
async function generatePDF({
  rows,
  columns,
  filename,
  reportTitle,
  template,
  signature,
  chartDataUrl,
}) {
  const { jsPDF } = await import('jspdf');

  const isLandscape = template !== 'minimal';
  const doc = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginX = 14;
  const tableWidth = pageW - marginX * 2;
  const colW = tableWidth / columns.length;
  const rowH = 8;
  const headerH = 9;

  const today = new Date().toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const time = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

  // ── TEMPLATE STYLES ────────────────────────────────────────────────────
  const styles = {
    corporate: {
      primary: [67, 56, 202],
      headerText: [255, 255, 255],
      stripBg: [243, 244, 246],
      rowAlt: [248, 248, 252],
      border: [200, 200, 215],
      text: [30, 30, 50],
      footerBg: [243, 244, 246],
    },
    minimal: {
      primary: [30, 30, 30],
      headerText: [255, 255, 255],
      stripBg: [248, 248, 248],
      rowAlt: [250, 250, 250],
      border: [220, 220, 220],
      text: [30, 30, 30],
      footerBg: [248, 248, 248],
    },
    dark: {
      primary: [30, 30, 46],
      headerText: [200, 200, 255],
      stripBg: [40, 40, 58],
      rowAlt: [36, 36, 52],
      border: [60, 60, 80],
      text: [220, 220, 240],
      footerBg: [30, 30, 46],
    },
  };
  const s = styles[template] || styles.corporate;

  // ── CHART PAGE (page 1 if chart available) ─────────────────────────────
  if (chartDataUrl) {
    // Header
    doc.setFillColor(...s.primary);
    doc.rect(0, 0, pageW, 18, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...s.headerText);
    doc.text(reportTitle || filename, pageW / 2, 12, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(today, pageW - marginX, 12, { align: 'right' });

    // Chart image — centred
    const chartH_mm = 60;
    const chartW_mm = pageW - marginX * 2;
    doc.addImage(chartDataUrl, 'PNG', marginX, 24, chartW_mm, chartH_mm);

    // Sub-caption
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 120);
    doc.text(
      `Gráfico resumo — ${rows.length} registo(s) | Gerado em: ${time}`,
      marginX,
      24 + chartH_mm + 6,
    );

    doc.addPage();
  }

  // ── DATA PAGES ─────────────────────────────────────────────────────────
  let y = 0;

  const drawPageHeader = (isFirst) => {
    doc.setFillColor(...s.primary);
    doc.rect(0, 0, pageW, 22, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...s.headerText);
    doc.text('Empresa', marginX, 14);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(reportTitle || filename, pageW / 2, 14, { align: 'center' });
    doc.setFontSize(9);
    doc.text(today, pageW - marginX, 14, { align: 'right' });

    doc.setFillColor(...s.stripBg);
    doc.rect(0, 22, pageW, 10, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 120);
    doc.setFont('helvetica', 'normal');
    if (isFirst) {
      doc.text(`Total de registos: ${rows.length}`, marginX, 28.5);
      doc.text(`Template: ${template} | Gerado em: ${time}`, pageW - marginX, 28.5, {
        align: 'right',
      });
    } else {
      doc.text(`${reportTitle || filename} — continuação`, marginX, 28.5);
    }
    y = 36;
  };

  const signatureFooterH = signature ? 28 : 0;

  const addFooter = (isLast) => {
    const footerY = pageH - 10 - signatureFooterH;

    // Signature block on last page
    if (isLast && signature) {
      doc.setFillColor(250, 250, 252);
      doc.rect(0, footerY - 4, pageW, signatureFooterH + 14, 'F');
      doc.setDrawColor(200, 200, 215);
      doc.setLineWidth(0.2);
      doc.line(marginX, footerY - 4, marginX + tableWidth, footerY - 4);

      doc.setFontSize(7.5);
      doc.setTextColor(100, 100, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('Assinatura digital:', marginX, footerY + 2);

      // Signature image
      const sigW = 50,
        sigH = 18;
      doc.addImage(signature, 'PNG', marginX, footerY + 4, sigW, sigH);

      doc.setFontSize(7);
      doc.setTextColor(150, 150, 170);
      doc.text(`Assinado digitalmente em ${today} às ${time}`, marginX, footerY + sigH + 7);
    }

    // Footer bar
    doc.setFillColor(...s.footerBg);
    doc.rect(0, pageH - 10, pageW, 10, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(130, 130, 150);
    doc.setFont('helvetica', 'normal');
    doc.text('Documento gerado automaticamente — uso interno', marginX, pageH - 3.5);
    doc.text(
      `Página ${doc.internal.getCurrentPageInfo().pageNumber}`,
      pageW - marginX,
      pageH - 3.5,
      { align: 'right' },
    );
  };

  const tableBottomLimit = (isLast) => pageH - 14 - signatureFooterH - (isLast ? 4 : 0);

  const drawTableHeader = () => {
    doc.setFillColor(...s.primary);
    doc.rect(marginX, y, tableWidth, headerH, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...s.headerText);
    columns.forEach((col, i) => {
      doc.text(col.label, marginX + i * colW + 3, y + 6, { maxWidth: colW - 4 });
    });
    y += headerH;
  };

  drawPageHeader(true);
  const tableStartY = y;
  drawTableHeader();

  rows.forEach((row, rowIdx) => {
    const isLastRow = rowIdx === rows.length - 1;
    if (y + rowH > tableBottomLimit(isLastRow)) {
      doc.setDrawColor(...s.border);
      doc.setLineWidth(0.3);
      doc.rect(marginX, tableStartY, tableWidth, y - tableStartY, 'S');
      addFooter(false);
      doc.addPage();
      drawPageHeader(false);
      drawTableHeader();
    }

    if (rowIdx % 2 === 0) {
      doc.setFillColor(...s.rowAlt);
      doc.rect(marginX, y, tableWidth, rowH, 'F');
    }

    if (template === 'dark') {
      doc.setTextColor(...s.text);
    } else {
      doc.setTextColor(...s.text);
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    columns.forEach((col, i) => {
      doc.text(String(row[col.key] ?? '—'), marginX + i * colW + 3, y + 5.5, {
        maxWidth: colW - 4,
      });
    });

    doc.setDrawColor(...s.border);
    doc.setLineWidth(0.2);
    doc.line(marginX, y + rowH, marginX + tableWidth, y + rowH);
    y += rowH;
  });

  doc.setDrawColor(...s.border);
  doc.setLineWidth(0.3);
  doc.rect(marginX, tableStartY, tableWidth, y - tableStartY, 'S');
  addFooter(true);

  doc.save(`${filename}_relatorio.pdf`);
}

// ── Modal component ────────────────────────────────────────────────────────
export default function PDFConfigModal({
  open,
  onClose,
  rows,
  allRows,
  columns,
  filename,
  reportTitle,
}) {
  const [scope, setScope] = useState('filtered');
  const [template, setTemplate] = useState('corporate');
  const [signature, setSignature] = useState('');
  const [includeChart, setIncludeChart] = useState(true);
  const [loading, setLoading] = useState(false);

  const isFiltered = rows.length !== allRows.length;
  const exportCols = columns.map(({ key, label }) => ({ key, label }));
  const data = scope === 'filtered' ? rows : allRows;

  const handleGenerate = async () => {
    setLoading(true);
    const chartDataUrl = includeChart ? buildChartImage(data, exportCols) : null;
    await generatePDF({
      rows: data,
      columns: exportCols,
      filename,
      reportTitle,
      template,
      signature: signature || null,
      chartDataUrl,
    });
    setLoading(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Configurar Relatório PDF</h2>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">
          {/* 1 — Data scope */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shrink-0">
                1
              </span>
              <h3 className="text-sm font-semibold text-foreground">Dados a incluir</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'filtered', label: `Dados filtrados`, count: rows.length },
                { id: 'all', label: `Todos os dados`, count: allRows.length },
              ].map(({ id, label, count }) => (
                <button
                  key={id}
                  onClick={() => setScope(id)}
                  disabled={id === 'filtered' && !isFiltered}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all',
                    scope === id
                      ? 'border-primary bg-primary/5 text-primary font-medium'
                      : 'border-border text-foreground hover:border-primary/40',
                    id === 'filtered' && !isFiltered && 'opacity-40 cursor-not-allowed',
                  )}
                >
                  <span>{label}</span>
                  <span
                    className={cn(
                      'text-xs font-semibold px-2 py-0.5 rounded-full',
                      scope === id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* 2 — Template */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shrink-0">
                2
              </span>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <LayoutTemplate className="h-4 w-4" /> Template de layout
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setTemplate(tmpl.id)}
                  className={cn(
                    'flex flex-col items-stretch rounded-lg border-2 overflow-hidden transition-all text-left',
                    template === tmpl.id
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/40',
                  )}
                >
                  <div className="relative h-20 bg-muted/30 p-1.5">{tmpl.preview}</div>
                  <div className="px-2.5 py-2 border-t border-border bg-card">
                    <p
                      className={cn(
                        'text-xs font-semibold',
                        template === tmpl.id ? 'text-primary' : 'text-foreground',
                      )}
                    >
                      {tmpl.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                      {tmpl.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* 3 — Chart */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shrink-0">
                3
              </span>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <BarChart2 className="h-4 w-4" /> Gráfico resumo
              </h3>
            </div>
            <label className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/20 transition-colors">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={includeChart}
                  onChange={(e) => setIncludeChart(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={cn(
                    'h-4 w-4 rounded border flex items-center justify-center transition-colors',
                    includeChart ? 'bg-primary border-primary' : 'border-input',
                  )}
                >
                  {includeChart && (
                    <svg
                      className="h-2.5 w-2.5 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 10 10"
                    >
                      <path
                        d="M1.5 5l2.5 2.5 4.5-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Incluir gráfico de barras resumo
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Gerado automaticamente a partir da primeira coluna numérica dos dados
                  seleccionados. Inserido antes da tabela.
                </p>
              </div>
            </label>
          </section>

          {/* 4 — Signature */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shrink-0">
                4
              </span>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <PenLine className="h-4 w-4" /> Assinatura digital (opcional)
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Se preenchida, a assinatura será inserida na última página, na secção de rodapé, com
              data/hora de assinatura.
            </p>
            <InlineSignaturePad value={signature} onChange={setSignature} />
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0 bg-muted/20">
          <div className="text-xs text-muted-foreground">
            {data.length} registo(s) · template <strong>{template}</strong>
            {signature && ' · c/ assinatura'}
            {includeChart && ' · c/ gráfico'}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              size="sm"
              className="gap-2 min-w-[130px]"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> A gerar…
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4" /> Gerar PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
