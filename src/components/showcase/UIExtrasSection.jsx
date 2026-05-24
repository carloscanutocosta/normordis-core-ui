import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "../ui-extra/ConfirmDialog";
import CommandPalette from "../ui-extra/CommandPalette";
import NotificationCenter from "../ui-extra/NotificationCenter";
import AvatarGroup from "../ui-extra/AvatarGroup";
import EmptyState from "../ui-extra/EmptyState";
import DragDropList from "../ui-extra/DragDropList";
import ImageGallery from "../ui-extra/ImageGallery";
import CodeBlock from "../ui-extra/CodeBlock";
import { Keyboard } from "lucide-react";

const USERS = [
  { id:1, name:"Ana Costa" },
  { id:2, name:"Bruno Melo" },
  { id:3, name:"Carla Nunes" },
  { id:4, name:"Diogo Ferreira" },
  { id:5, name:"Eva Martins" },
  { id:6, name:"Francisco Pereira" },
];

const CODE_SAMPLE = `import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex gap-2 items-center">
      <button onClick={() => setCount(c => c - 1)}>−</button>
      <span>{count}</span>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}`;

export default function UIExtrasSection() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmVariant, setConfirmVariant] = useState("danger");
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <div className="space-y-8">

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Confirm Dialog</CardTitle>
          <CardDescription>Modal de confirmação reutilizável em 4 variantes</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {["danger","warning","info","success"].map((v) => (
            <Button key={v} variant="outline" size="sm" onClick={() => { setConfirmVariant(v); setConfirmOpen(true); }}>
              {v}
            </Button>
          ))}
          <ConfirmDialog
            open={confirmOpen}
            variant={confirmVariant}
            title={confirmVariant === "danger" ? "Eliminar registo?" : confirmVariant === "warning" ? "Atenção" : confirmVariant === "info" ? "Informação" : "Sucesso"}
            description="Esta acção não pode ser desfeita. Tem a certeza que deseja continuar?"
            confirmLabel={confirmVariant === "danger" ? "Eliminar" : "Confirmar"}
            onConfirm={() => setConfirmOpen(false)}
            onCancel={() => setConfirmOpen(false)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Command Palette</CardTitle>
          <CardDescription>Pesquisa global estilo ⌘K com atalhos de teclado</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="gap-2" onClick={() => setCmdOpen(true)}>
            <Keyboard className="h-4 w-4" />
            Abrir Command Palette
            <kbd className="ml-1 text-[10px] border border-border rounded px-1.5 py-0.5">⌘K</kbd>
          </Button>
          <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Center</CardTitle>
          <CardDescription>Painel de notificações com histórico, tipos e dismiss</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">Clique no sino →</p>
            <NotificationCenter />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Avatar Group</CardTitle>
          <CardDescription>Sobreposição de avatares com contador de excedente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[{size:"sm",max:3},{size:"md",max:4},{size:"lg",max:5}].map(({size,max}) => (
            <div key={size} className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground w-8">{size}</span>
              <AvatarGroup users={USERS} size={size} max={max} />
              <span className="text-xs text-muted-foreground">{USERS.length} utilizadores, max {max}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Empty State</CardTitle>
          <CardDescription>Placeholder ilustrado para listas e páginas vazias</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["empty","search","error","noFiles"].map((preset) => (
            <div key={preset} className="border border-border rounded-lg">
              <EmptyState preset={preset} size="sm" actionLabel={preset === "empty" ? "Adicionar" : undefined} onAction={() => {}} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Drag & Drop List</CardTitle>
          <CardDescription>Lista reordenável por arrastar</CardDescription>
        </CardHeader>
        <CardContent>
          <DragDropList />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Image Gallery</CardTitle>
          <CardDescription>Galeria com grelha e lightbox de navegação</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageGallery columns={3} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Code Block</CardTitle>
          <CardDescription>Bloco de código com numeração, syntax highlight e botão de cópia</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={CODE_SAMPLE} language="jsx" filename="Counter.jsx" />
        </CardContent>
      </Card>

    </div>
  );
}