import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TreeView from "../data/TreeView";
import ListView from "../data/ListView.jsx";
import DataTable from "../data/DataTable";
import Timeline from "../data/Timeline";
import AccordionMenu from "../data/AccordionMenu";
import Breadcrumbs from "../data/Breadcrumbs";
import Stepper from "../data/Stepper";
import { PillTabs, UnderlineTabs, VerticalTabs } from "../data/Tabs";
import AlertBanner from "../data/AlertBanner";
import StatCard from "../data/StatCard";
import RecordModal from "../data/RecordModal";
import { useState } from "react";
import { Users, BarChart2, ShoppingCart, TrendingUp, FileText, Shield } from "lucide-react";
import {
  HamburgerMenu,
  KebabMenu,
  MeatballMenu,
  DropdownWithSubmenu,
  SpeedDial,
  ContextMenuDemo,
} from "../data/MenuShowcase";

// ── TreeView data ──────────────────────────────────────────────────────────
const treeData = [
  {
    id: "1", label: "src", defaultOpen: true, children: [
      {
        id: "1.1", label: "components", defaultOpen: true, children: [
          { id: "1.1.1", label: "Button.jsx", children: [] },
          { id: "1.1.2", label: "Input.jsx", children: [] },
          { id: "1.1.3", label: "Card.jsx", children: [] },
        ],
      },
      {
        id: "1.2", label: "pages", children: [
          { id: "1.2.1", label: "Home.jsx", children: [] },
          { id: "1.2.2", label: "Dashboard.jsx", children: [] },
        ],
      },
      { id: "1.3", label: "App.jsx", children: [] },
      { id: "1.4", label: "main.jsx", children: [] },
    ],
  },
  {
    id: "2", label: "public", children: [
      { id: "2.1", label: "favicon.ico", children: [] },
      { id: "2.2", label: "logo.png", children: [] },
    ],
  },
  { id: "3", label: "package.json", children: [] },
  { id: "4", label: "tailwind.config.js", children: [] },
];

// ── ListView data ──────────────────────────────────────────────────────────
const listColumns = [
  { key: "name",   label: "Nome" },
  { key: "role",   label: "Função" },
  { key: "status", label: "Estado", render: (v) => (
    <Badge className={v === "Ativo" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}>{v}</Badge>
  )},
];

const listItems = [
  { id: 1, name: "Ana Costa",      role: "Engenheira",   status: "Ativo" },
  { id: 2, name: "Bruno Melo",     role: "Designer",     status: "Inativo" },
  { id: 3, name: "Carla Nunes",    role: "Gestora",      status: "Ativo" },
  { id: 4, name: "Diogo Ferreira", role: "Dev Backend",  status: "Ativo" },
  { id: 5, name: "Eva Martins",    role: "QA",           status: "Inativo" },
];

// ── DataTable data ─────────────────────────────────────────────────────────
const tableColumns = [
  { key: "id",       label: "ID" },
  { key: "product",  label: "Produto" },
  { key: "category", label: "Categoria" },
  { key: "price",    label: "Preço",   render: (v) => `€ ${Number(v).toFixed(2)}` },
  { key: "stock",    label: "Stock",   render: (v) => (
    <span className={Number(v) < 10 ? "text-destructive font-medium" : ""}>{v}</span>
  )},
  { key: "status",   label: "Estado",  inlineOptions: ["Disponível", "Esgotado"], render: (v) => (
    <Badge className={v === "Disponível" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>{v}</Badge>
  )},
];

const tableRows = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  product:  ["Teclado Mecânico","Monitor 4K","Rato Sem Fio","Webcam HD","Headset Pro","Hub USB-C","SSD 1TB","RAM 32GB"][i % 8],
  category: ["Periféricos","Ecrãs","Periféricos","Câmeras","Áudio","Acessórios","Armazenamento","Memória"][i % 8],
  price:    [89.99,549.00,39.99,79.99,129.99,49.99,109.99,159.99][i % 8],
  stock:    [45,12,3,27,8,100,15,6][i % 8],
  status:   i % 5 === 0 ? "Esgotado" : "Disponível",
}));

// ── Timeline data ──────────────────────────────────────────────────────────
const timelineVertical = [
  { id: 1, label: "Pedido recebido",      description: "O pedido foi registado no sistema.",       status: "completed", timestamp: "01/05/2026 09:00" },
  { id: 2, label: "Em análise",           description: "A equipa está a validar os dados.",        status: "completed", timestamp: "01/05/2026 10:30" },
  { id: 3, label: "Aprovação pendente",   description: "Aguarda aprovação do responsável.",        status: "active",    timestamp: "01/05/2026 11:15" },
  { id: 4, label: "Processamento",        description: "Será processado após aprovação.",          status: "pending",   timestamp: null },
  { id: 5, label: "Concluído",            description: "Processo finalizado com sucesso.",         status: "pending",   timestamp: null },
];

const timelineHorizontal = [
  { id: 1, label: "Início",       description: "Arranque",     status: "completed" },
  { id: 2, label: "Revisão",      description: "Em curso",     status: "completed" },
  { id: 3, label: "Aprovação",    description: "Activo",       status: "active" },
  { id: 4, label: "Publicação",   description: "Pendente",     status: "pending" },
  { id: 5, label: "Arquivo",      description: "Pendente",     status: "pending" },
];

const timelineWithError = [
  { id: 1, label: "Ligação iniciada",    status: "completed", timestamp: "09:00" },
  { id: 2, label: "Autenticação",        status: "completed", timestamp: "09:01" },
  { id: 3, label: "Transferência",       status: "error",     description: "Falha na ligação ao servidor.", timestamp: "09:03" },
  { id: 4, label: "Validação",           status: "pending" },
  { id: 5, label: "Concluído",           status: "pending" },
];

// ── Stepper data ───────────────────────────────────────────────────────────
const stepperSteps = [
  { label: "Dados pessoais",  description: "Preencha o seu nome, email e número de telefone." },
  { label: "Endereço",        description: "Indique a morada de faturação e entrega." },
  { label: "Pagamento",       description: "Escolha o método de pagamento e insira os dados." },
  { label: "Confirmação",     description: "Reveja o pedido e confirme a encomenda." },
];

// ── Tabs data ───────────────────────────────────────────────────────────────
const tabItems = [
  { id: "overview",  label: "Visão Geral",  content: "Resumo geral do projecto com métricas e indicadores principais.", icon: BarChart2 },
  { id: "reports",   label: "Relatórios",   content: "Lista de relatórios gerados automaticamente pela plataforma.", icon: FileText },
  { id: "users",     label: "Utilizadores", content: "Gestão de utilizadores, permissões e grupos de acesso.", icon: Users },
  { id: "settings",  label: "Definições",   content: "Configurações gerais da conta, integrações e preferências.", icon: Shield },
];

// ── Breadcrumbs data ────────────────────────────────────────────────────────
const breadcrumbItems = [
  { label: "Início" },
  { label: "Definições", icon: false },
  { label: "Utilizadores", icon: false },
  { label: "Ana Costa", icon: false },
];

// ── Modal field definitions ────────────────────────────────────────────────
const tableFields = [
  { key: "id",       label: "ID",         editable: false },
  { key: "product",  label: "Produto" },
  { key: "category", label: "Categoria" },
  { key: "price",    label: "Preço (€)",  type: "number" },
  { key: "stock",    label: "Stock",      type: "number" },
  { key: "status",   label: "Estado" },
];

const listFields = [
  { key: "id",     label: "ID",      editable: false },
  { key: "name",   label: "Nome" },
  { key: "role",   label: "Função" },
  { key: "status", label: "Estado" },
];

// ── Component ──────────────────────────────────────────────────────────────
export default function DataSection() {
  const [modal, setModal] = useState(null); // { record, fields, mode, title }
  const [tableRowsState, setTableRowsState] = useState(tableRows);

  const handleCellEdit = (rowId, key, value) => {
    setTableRowsState((prev) => prev.map((r) => r.id === rowId ? { ...r, [key]: value } : r));
  };

  const openModal = (mode, record, fields, title) =>
    setModal({ record, fields, mode, title });

  const closeModal = () => setModal(null);

  return (
    <div className="space-y-8">

      {/* Record Modal */}
      {modal && (
        <RecordModal
          record={modal.record}
          fields={modal.fields}
          mode={modal.mode}
          title={modal.title}
          subtitle={`ID: ${modal.record.id}`}
          onClose={closeModal}
          onSave={(updated) => { console.log("Saved:", updated); closeModal(); }}
          onDelete={(rec) => { console.log("Deleted:", rec); closeModal(); }}
        />
      )}

      {/* Stat Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Stat Cards</CardTitle>
          <CardDescription>Cartões de métricas com ícone, valor e indicador de tendência</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Utilizadores" value={4821}   icon={Users}        trend={12.4}  trendLabel="vs mês anterior" />
            <StatCard label="Receita"      value={18340}  prefix="€ "         trend={7.2}   trendLabel="vs mês anterior" icon={TrendingUp} />
            <StatCard label="Encomendas"   value={342}    icon={ShoppingCart} trend={-3.1}  trendLabel="vs mês anterior" />
            <StatCard label="Relatórios"   value={29}     icon={BarChart2}    trend={0}     trendLabel="sem alteração" />
          </div>
        </CardContent>
      </Card>

      {/* Alert Banners */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alert Banners</CardTitle>
          <CardDescription>Banners de feedback — informação, sucesso, aviso, erro (com dismiss)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <AlertBanner variant="info"    title="Nova versão disponível" description="Actualize a aplicação para aceder às últimas funcionalidades." dismissible />
          <AlertBanner variant="success" title="Guardado com sucesso"   description="As suas alterações foram guardadas." dismissible />
          <AlertBanner variant="warning" title="Atenção"               description="O período de avaliação termina em 3 dias." dismissible />
          <AlertBanner variant="error"   title="Erro de ligação"        description="Não foi possível ligar ao servidor. Tente novamente." dismissible />
        </CardContent>
      </Card>

      {/* Breadcrumbs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Breadcrumbs</CardTitle>
          <CardDescription>Navegação hierárquica com ícone de início</CardDescription>
        </CardHeader>
        <CardContent>
          <Breadcrumbs items={breadcrumbItems} />
        </CardContent>
      </Card>

      {/* Stepper */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Stepper</CardTitle>
          <CardDescription>Guia de passos com navegação interactiva</CardDescription>
        </CardHeader>
        <CardContent>
          <Stepper steps={stepperSteps} />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tabs</CardTitle>
          <CardDescription>Três variantes — Pill, Underline e Vertical</CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Pill</p>
            <PillTabs tabs={tabItems} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Underline</p>
            <UnderlineTabs tabs={tabItems} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Vertical</p>
            <VerticalTabs tabs={tabItems} />
          </div>
        </CardContent>
      </Card>

      {/* Accordion Menu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Accordion Menu</CardTitle>
          <CardDescription>Menu de navegação lateral com grupos expansíveis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs border border-border rounded-lg p-2">
            <AccordionMenu />
          </div>
        </CardContent>
      </Card>

      {/* TreeView */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">TreeView</CardTitle>
          <CardDescription>Hierarquia em árvore expansível com seleção</CardDescription>
        </CardHeader>
        <CardContent>
          <TreeView nodes={treeData} className="max-w-sm" />
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
          <CardDescription>Visualização de etapas de um procedimento — vertical, horizontal e com erro</CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Vertical</p>
            <Timeline steps={timelineVertical} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Horizontal</p>
            <Timeline steps={timelineHorizontal} orientation="horizontal" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Com erro</p>
            <Timeline steps={timelineWithError} />
          </div>
        </CardContent>
      </Card>

      {/* Menus */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Menus</CardTitle>
          <CardDescription>Hamburger, Kebab (⋮), Meatball (⋯), Dropdown com submenu, Speed Dial e Context Menu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

            {/* Hamburger */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Hamburger</p>
              <div className="border rounded-lg px-4 py-3 flex items-center gap-4 relative">
                <HamburgerMenu />
                <span className="text-sm text-muted-foreground">Navegação mobile</span>
              </div>
            </div>

            {/* Kebab */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Kebab ⋮</p>
              <div className="border rounded-lg px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-foreground">Item de lista</span>
                <KebabMenu />
              </div>
            </div>

            {/* Meatball */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Meatball ⋯</p>
              <div className="border rounded-lg px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-foreground">Cartão de conteúdo</span>
                <MeatballMenu />
              </div>
            </div>

            {/* Dropdown with submenu */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dropdown com submenu</p>
              <div className="border rounded-lg px-4 py-3">
                <DropdownWithSubmenu />
              </div>
            </div>

            {/* Speed Dial */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Speed Dial (FAB)</p>
              <div className="border rounded-lg px-4 py-6 flex items-end justify-center min-h-[140px]">
                <SpeedDial />
              </div>
            </div>

            {/* Context Menu */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Context Menu</p>
              <div className="border rounded-lg px-4 py-3">
                <ContextMenuDemo />
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* ListView */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ListView</CardTitle>
          <CardDescription>Lista com filtro, ordenação e seleção múltipla</CardDescription>
        </CardHeader>
        <CardContent>
          <ListView
            items={listItems}
            columns={listColumns}
            selectable
            onRowAction={(action, item) =>
              openModal(action === "delete" ? "edit" : action, item, listFields, item.name)
            }
          />
        </CardContent>
      </Card>

      {/* DataTable */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">DataTable</CardTitle>
          <CardDescription>Tabela com pesquisa, ordenação, paginação e painel de filtros avançados</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            rows={tableRowsState}
            columns={tableColumns}
            onCellEdit={handleCellEdit}
            pageSize={5}
            onRowAction={(action, row) =>
              openModal(action === "delete" ? "edit" : action, row, tableFields, row.product)
            }
            filterDefs={[
              { key: "category", label: "Categoria", type: "select",
                options: ["Periféricos","Ecrãs","Câmeras","Áudio","Acessórios","Armazenamento","Memória"] },
              { key: "status",   label: "Estado",    type: "select", options: ["Disponível","Esgotado"] },
              { key: "product",  label: "Produto",   type: "text" },
            ]}
          />
        </CardContent>
      </Card>

    </div>
  );
}