import { useEffect } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { $getRoot } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import NormordisEditorLexical from '@/components/editor/NormordisEditorLexical';
import NormordisEditorToolbar from '@/components/editor/NormordisEditorToolbar';
import DocumentEditor from '@/components/editor/DocumentEditor';
import RichTextInput from '@/components/forms/RichTextInput';
import { exportToNcrtf, ncrtfToLexical } from '@/components/editor/serializers/ncrtf';

// JSON persistido no formato clássico, independente da exportação da versão nova.
function savedDocument(text = 'Documento guardado') {
  return {
    root: {
      type: 'root',
      version: 1,
      format: '',
      indent: 0,
      direction: null,
      children: [
        {
          type: 'paragraph',
          version: 1,
          format: '',
          indent: 0,
          direction: null,
          children: [
            {
              type: 'text',
              version: 1,
              text,
              format: 1,
              detail: 0,
              mode: 'normal',
              style: '',
            },
          ],
        },
        {
          type: 'image',
          version: 1,
          src: 'imagem.png',
          altText: 'Imagem guardada',
          caption: 'Legenda guardada',
          width: 75,
        },
        {
          type: 'simple-table',
          version: 1,
          columns: 2,
          includeHeader: true,
          rows: [
            ['Nome', 'Valor'],
            ['Exemplo', '42'],
          ],
        },
      ],
    },
  };
}

describe('Compatibilidade Lexical', () => {
  it('carrega JSON guardado e sincroniza um novo valor externo', async () => {
    const { rerender } = render(
      <NormordisEditorLexical value={savedDocument()} label="Documento" readOnly />,
    );
    expect(screen.getByRole('textbox', { name: 'Documento' })).toHaveTextContent(
      'Documento guardado',
    );
    expect(screen.getByRole('img', { name: 'Imagem guardada' })).toHaveAttribute(
      'src',
      'imagem.png',
    );
    expect(screen.getByRole('textbox', { name: 'Linha 2, coluna 2' })).toHaveValue('42');
    rerender(
      <NormordisEditorLexical
        value={savedDocument('Valor substituído')}
        label="Documento"
        readOnly
      />,
    );
    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'Documento' })).toHaveTextContent(
        'Valor substituído',
      ),
    );
  });

  it('atualiza a toolbar com a seleção e emite alterações dos nós personalizados', async () => {
    let editor;
    function Toolbar() {
      const [current] = useLexicalComposerContext();
      useEffect(() => {
        editor = current;
      }, [current]);
      return <NormordisEditorToolbar />;
    }
    const onChange = vi.fn();
    render(
      <NormordisEditorLexical
        defaultValue={savedDocument()}
        label="Documento"
        ToolbarComponent={Toolbar}
        onChange={onChange}
      />,
    );
    await act(async () => {
      editor.update(() => {
        $getRoot().getFirstChild().getFirstChild().select(0, 4);
      });
    });
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Negrito', exact: true })).toHaveAttribute(
        'aria-pressed',
        'true',
      ),
    );
    fireEvent.change(screen.getByRole('slider', { name: 'Largura da imagem' }), {
      target: { value: '50' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'Linha 2, coluna 2' }), {
      target: { value: '84' },
    });
    await waitFor(() => {
      const payload = onChange.mock.lastCall[0];
      expect(payload.lexical.root.children.find((node) => node.type === 'image').width).toBe(50);
      expect(
        payload.lexical.root.children.find((node) => node.type === 'simple-table').rows[1][1],
      ).toBe('84');
    });
  });

  it('preserva conteúdo no ciclo Lexical → NCRTF → Lexical → NCRTF', () => {
    const exported = exportToNcrtf(savedDocument());
    expect(exported.content).toHaveLength(3);
    const restored = ncrtfToLexical(exported);
    expect(exportToNcrtf(restored)).toEqual(exported);
  });

  it('exporta o documento através do callback público', () => {
    const onExport = vi.fn();
    const value = savedDocument();
    render(<DocumentEditor value={value} label="Documento" readOnly onExport={onExport} />);
    fireEvent.click(screen.getByRole('button', { name: 'Exportar .ncrtf' }));
    expect(onExport).toHaveBeenCalledWith('ncrtf', exportToNcrtf(value));
  });

  it('importa HTML no RichTextInput', () => {
    render(<RichTextInput label="Notas" value="<p>Texto <strong>importado</strong></p>" />);
    expect(screen.getByText('importado')).toBeInTheDocument();
  });
});
