import { useMemo, useState } from "react";
import { DocumentEditor } from "@/components/editor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const semanticBlocks = [
  {
    id: "notice.validation",
    label: "Nota de validação",
    category: "Notas",
    description: "Texto padrão para documentos em validação.",
    content: {
      type: "paragraphs",
      blocks: [
        "Este documento encontra-se em fase de validação e pode ser revisto antes da sua consolidação documental.",
      ],
    },
  },
  {
    id: "custody.reference",
    label: "Referência de custódia",
    category: "Custódia",
    content: {
      type: "template",
      text: "A versão sob custódia será integrada pelo core-documental após validação do payload NCRTF.",
    },
  },
  {
    id: "signature.standard",
    label: "Assinatura padrão",
    category: "Assinaturas",
    placeholders: [
      { id: "name", label: "Nome" },
      { id: "role", label: "Função" },
    ],
    content: {
      type: "template",
      text: "{{name}}\n{{role}}",
    },
  },
];

export default function EditorPlayground() {
  const [documentValue, setDocumentValue] = useState(null);
  const [exportedPayload, setExportedPayload] = useState(null);

  const payloadPreview = useMemo(() => {
    if (!exportedPayload) return "Exporta o documento para pré-visualizar NCRTF.";
    return JSON.stringify(exportedPayload, null, 2);
  }, [exportedPayload]);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Editor Lexical NCRTF
          </h2>
          <Badge variant="secondary">novo</Badge>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Demonstração do editor rich text baseado em Lexical, com toolbar
          substituível, blocos semânticos e serialização canónica para NCRTF.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <Card>
          <CardHeader>
            <CardTitle>Documento em composição</CardTitle>
            <CardDescription>
              Fluxo previsto: Lexical JSON para NCRTF, depois core-documental
              para NDF de custódia em DB.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentEditor
              label="Conteúdo documental"
              description="Usa a toolbar ou insere blocos semânticos configuráveis."
              placeholder="Escreve o conteúdo do documento..."
              value={documentValue}
              onChange={setDocumentValue}
              onExport={(_format, payload) => setExportedPayload(payload)}
              exportOptions={{
                pretty: true,
                metadata: {
                  title: "Documento de demonstração",
                  locale: "pt-PT",
                },
              }}
              semanticBlocks={semanticBlocks}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payload NCRTF</CardTitle>
            <CardDescription>
              O core-ui gera o contrato; a app decide se guarda, descarrega ou
              envia para backend.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="max-h-[520px] overflow-auto rounded-md border border-border bg-muted/50 p-3 text-xs leading-relaxed text-foreground">
              {payloadPreview}
            </pre>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
