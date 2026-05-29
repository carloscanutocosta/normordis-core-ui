# Normordis Core UI — Workspace SDK
## Manual de Consumo

> **Versão:** 1.0.0 · **Pacote:** `@carloscanutocosta/core-ui`

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Início Rápido](#2-início-rápido)
3. [Definição de Apps](#3-definição-de-apps)
4. [Construção de Apps](#4-construção-de-apps)
5. [Hook `useApp()`](#5-hook-useapp)
6. [Navegação inter-app](#6-navegação-inter-app)
7. [Notificações](#7-notificações)
8. [Badges no LeftRail](#8-badges-no-leftrail)
9. [Paleta de Comandos](#9-paleta-de-comandos)
10. [Painel de Atendimento](#10-painel-de-atendimento)
11. [Painéis Direitos (Ferramentas)](#11-painéis-direitos-ferramentas)
12. [Temas WCAG](#12-temas-wcag)
13. [Referência de Props — AppShell](#13-referência-de-props--appshell)
14. [Tipos TypeScript](#14-tipos-typescript)
15. [Composição Avançada](#15-composição-avançada)
16. [Exemplos Completos](#16-exemplos-completos)

---

## 1. Visão Geral

O **Workspace SDK** é uma shell institucional incluída no `normordis-core-ui`.
Fornece estrutura de navegação, gestão de tabs, paleta de comandos, notificações
e painel de atendimento prontos a usar. Os consumidores implementam as suas
próprias apps como componentes React e registam-nas na shell.

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│  Header  (Logo · Search/CommandPalette · Bell · Tema · User)    │
├──────────┬────────────────────────────────────┬─────────────────┤
│          │  TabBar                            │                 │
│ LeftRail │────────────────────────────────────│  RightPanel     │
│  (apps)  │                                    │  (tool panel)   │
│          │  ContentArea                       │                 │
│  [badge] │  ┌──────────────────────────────┐ ├─────────────────┤
│          │  │  <AppA /> — display:none     │ │   RightRail     │
│          │  │  <AppB /> — display:block    │ │  (tool buttons) │
│          │  └──────────────────────────────┘ │                 │
├──────────┴────────────────────────────────────┴─────────────────┤
│  StatusBar  (Online · User · Relógio · Registar Atendimento)    │
└─────────────────────────────────────────────────────────────────┘
```

### Conceitos-chave

| Conceito | Descrição |
|---|---|
| **App** | Componente React registado via `AppDefinition`. Tem id, label, ícone e categoria. |
| **Tab** | Instância de uma app aberta. Gerida automaticamente ao navegar. |
| **LeftRail** | Navegação lateral. Colapsa em ícones no desktop; overlay drawer em mobile. |
| **RightRail + RightPanel** | Ferramentas opcionais com painéis laterais direitos. |
| **CommandPalette** | Paleta global (Ctrl+K). Agrega apps, comandos da app activa e estáticos. |
| **`useApp()`** | Hook para app-developers. navigate, notify, setBadge, registerCommands. |
| **Atendimento** | Painel de registo de atendimento com persistência durante a sessão. |

---

## 2. Início Rápido

### Instalação

```bash
pnpm add @carloscanutocosta/core-ui
```

Dependências de pares necessárias no projecto consumidor:

```bash
pnpm add react react-dom lucide-react
# Para usar WorkspaceCommandPalette (opcional):
pnpm add cmdk
```

### Configuração do Tailwind

No `tailwind.config.js`, adicionar o caminho do SDK ao `content`:

```js
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@carloscanutocosta/core-ui/dist/**/*.js', // ← obrigatório
  ],
};
```

Importar o CSS e restaurar o tema antes da renderização:

```js
// src/main.tsx
import '@carloscanutocosta/core-ui/styles';
import { applyTheme, getStoredTheme } from '@carloscanutocosta/core-ui';

applyTheme(getStoredTheme()); // evita flash de tema errado

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

### Uso Mínimo

```jsx
import { AppShell } from '@carloscanutocosta/core-ui/workspace';
import { LayoutDashboard, FileText } from 'lucide-react';

const APPS = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard, category: 'core' },
  { id: 'documents', label: 'Documentos', icon: FileText,         category: 'core' },
];

export default function App() {
  return (
    <AppShell
      apps={APPS}
      appName="Minha Aplicação"
      user={{ name: 'Ana Silva', email: 'ana@empresa.pt' }}
      onLogout={() => auth.logout()}
    >
      {(appId) => {
        if (appId === 'dashboard') return <DashboardApp />;
        if (appId === 'documents') return <DocumentsApp />;
        return null;
      }}
    </AppShell>
  );
}
```

O `AppShell` deve ocupar o viewport completo. Garantir `height: 100vh` no elemento pai (ou usar `h-screen` no elemento root).

---

## 3. Definição de Apps

Cada app é descrita por um objecto `AppDefinition`:

```ts
interface AppDefinition {
  id:        string;         // identificador único — usado na render function e navegação
  label:     string;         // nome visível no LeftRail e TabBar
  icon:      IconComponent;  // componente Lucide (ou qualquer SVG como componente)
  category?: 'core' | 'system' | string;
}
```

### Categorias

| Valor | Posição no LeftRail |
|---|---|
| `'core'` | Grupo principal, acima do separador |
| `'system'` | Grupo sistema, abaixo do separador (ex: Definições) |

### Exemplo completo

```js
import {
  LayoutDashboard, FileText, BarChart3,
  Users, CheckSquare, Settings,
} from 'lucide-react';

const APPS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard, category: 'core'   },
  { id: 'documents',  label: 'Documentos', icon: FileText,         category: 'core'   },
  { id: 'analytics',  label: 'Analíticas', icon: BarChart3,        category: 'core'   },
  { id: 'team',       label: 'Equipa',     icon: Users,            category: 'core'   },
  { id: 'tasks',      label: 'Tarefas',    icon: CheckSquare,      category: 'core'   },
  { id: 'settings',   label: 'Definições', icon: Settings,         category: 'system' },
];
```

---

## 4. Construção de Apps

### Padrão da render function

O prop `children` do `AppShell` é uma **render function** — recebe o `appId`
da tab e devolve o componente correspondente:

```jsx
<AppShell apps={APPS} ...>
  {(appId) => {
    switch (appId) {
      case 'dashboard':  return <DashboardApp />;
      case 'documents':  return <DocumentsApp />;
      case 'tasks':      return <TasksApp />;
      default:           return null;
    }
  }}
</AppShell>
```

> **Estado preservado:** Todas as tabs abertas são renderizadas em simultâneo
> com CSS `display: none` nas inactivas. O estado de scroll, formulários e
> dados carregados **mantém-se** ao trocar de app.

### App simples

```jsx
export default function DashboardApp() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <button onClick={() => setCount(c => c + 1)}>
        Cliques: {count}
      </button>
    </div>
  );
}
```

O `count` **mantém-se** ao navegar para outra app e voltar.

### App com dados assíncronos

```jsx
export default function DocumentsApp() {
  const [docs, setDocs] = useState(null);

  useEffect(() => {
    fetch('/api/documents')
      .then(r => r.json())
      .then(setDocs);
  }, []);

  if (!docs) return <LoadingSpinner />;
  return <DocumentList docs={docs} />;
}
```

O fetch ocorre **uma só vez**, na primeira abertura da tab. Visitas
subsequentes mostram os dados já carregados.

### Com code splitting (React.lazy)

```jsx
const DashboardApp = lazy(() => import('./apps/DashboardApp'));
const DocumentsApp = lazy(() => import('./apps/DocumentsApp'));

<AppShell apps={APPS} ...>
  {(appId) => (
    <Suspense fallback={<div className="p-6 text-muted-foreground">A carregar...</div>}>
      {appId === 'dashboard' && <DashboardApp />}
      {appId === 'documents' && <DocumentsApp />}
    </Suspense>
  )}
</AppShell>
```

---

## 5. Hook `useApp()`

O `useApp()` é o principal ponto de integração para os app-developers.
Deve ser chamado dentro de componentes renderizados pelo AppShell.

```jsx
import { useApp } from '@carloscanutocosta/core-ui/workspace';

export default function MyApp() {
  const {
    appId,            // string — id desta app
    params,           // unknown — params recebidos via navigate()
    navigate,         // (appId, params?) => void
    notify,           // (notification) => void
    setBadge,         // (count: number) => void
    registerCommands, // (commands[]) => () => void  (devolve cleanup)
    openCommand,      // () => void
  } = useApp();
}
```

### Referência completa

| Propriedade | Tipo | Descrição |
|---|---|---|
| `appId` | `string` | Identificador desta app |
| `params` | `unknown` | Parâmetros recebidos de outra app via `navigate()` |
| `navigate(appId, params?)` | `function` | Navega para outra app, opcionalmente com dados |
| `notify(notification)` | `function` | Publica notificação no painel de notificações |
| `setBadge(count)` | `function` | Define contador no ícone do LeftRail (0 = ocultar) |
| `registerCommands(cmds)` | `function` | Regista comandos na paleta; devolve cleanup |
| `openCommand()` | `function` | Abre a paleta de comandos programaticamente |

> `useApp()` lança erro se chamado fora de um componente renderizado pelo
> AppShell. Não chamar em providers externos ou componentes de layout globais.

---

## 6. Navegação inter-app

### Navegar sem dados

```jsx
const { navigate } = useApp();

<button onClick={() => navigate('documents')}>
  Abrir Documentos
</button>
```

A app de destino é aberta (ou activada se já estiver numa tab) e o foco muda para ela.

### Navegar com parâmetros

```jsx
// App de origem (ex: dashboard)
const { navigate } = useApp();

navigate('documents', { filter: 'recent', highlight: 'relatorio-q1.pdf' });
```

```jsx
// App de destino (documents)
export default function DocumentsApp() {
  const { params } = useApp();
  // params = { filter: 'recent', highlight: 'relatorio-q1.pdf' }

  useEffect(() => {
    if (params?.highlight) {
      scrollToDocument(params.highlight);
    }
  }, [params]);
}
```

Os parâmetros persistem enquanto a tab estiver aberta e são substituídos
na próxima chamada `navigate()` para a mesma app.

### TypeScript — tipar os parâmetros

```ts
interface DocumentParams {
  filter?:    'recent' | 'all';
  highlight?: string;
}

const { params } = useApp();
const p = params as DocumentParams | undefined;
```

---

## 7. Notificações

O painel de notificações (Bell no Header) agrega duas fontes:

| Fonte | Origem | Gestão |
|---|---|---|
| **Internas** | `useApp().notify()` | Automática pelo WorkspaceContext |
| **Externas** | Props `notifications` do AppShell | Consumer (servidor/WebSocket) |

### Notificações internas — de dentro de uma app

```jsx
const { notify } = useApp();

const handleExport = async () => {
  try {
    await exportPDF();
    notify({
      title:       'Exportação concluída',
      description: 'O PDF foi gerado com sucesso.',
      type:        'success',
    });
  } catch (err) {
    notify({
      title:       'Erro na exportação',
      description: err.message,
      type:        'error',
    });
  }
};
```

### Notificações externas — do servidor

```jsx
const [notifications, setNotifications] = useState([]);

useEffect(() => {
  const ws = new WebSocket('/ws/notifications');
  ws.onmessage = (e) => {
    setNotifications(prev => [JSON.parse(e.data), ...prev]);
  };
  return () => ws.close();
}, []);

<AppShell
  notifications={notifications}
  onNotificationRead={(id) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }
  onNotificationsReadAll={() =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }
  onNotificationClear={(id) =>
    setNotifications(prev => id ? prev.filter(n => n.id !== id) : [])
  }
/>
```

### Tipos de notificação

| Tipo | Ícone | Cor |
|---|---|---|
| `'info'` | Info | Azul |
| `'success'` | CheckCircle | Verde-esmeralda |
| `'warning'` | AlertTriangle | Âmbar |
| `'error'` | XCircle | Vermelho destrutivo |

### Interface `WorkspaceNotification`

```ts
interface WorkspaceNotification {
  id:           string;
  title:        string;
  description?: string;
  time?:        string;   // ex: "há 5 min"
  read?:        boolean;
  type?:        'info' | 'success' | 'warning' | 'error';
}
```

---

## 8. Badges no LeftRail

Os badges mostram contadores no ícone da app na barra lateral — tarefas
pendentes, mensagens não lidas, alertas, etc.

```jsx
const { setBadge } = useApp();

// Definir
setBadge(unreadMessages.length);

// Remover (ocultar)
setBadge(0);
```

### Comportamento visual

| Modo | Posição |
|---|---|
| LeftRail expandido | Chip numérico alinhado à direita do label |
| LeftRail colapsado | Chip no canto superior direito do ícone |
| Tooltip | Inclui o valor entre parênteses |

Valores superiores a 99 mostram **"99+"**.

### Exemplo com polling

```jsx
export default function TasksApp() {
  const { setBadge } = useApp();

  useEffect(() => {
    const update = async () => {
      const { pending } = await fetchTaskStats();
      setBadge(pending);
    };
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, [setBadge]);
}
```

---

## 9. Paleta de Comandos

Activada com **Ctrl+K** (ou ⌘K no Mac). Agrega três grupos em ordem:

| Grupo | Fonte |
|---|---|
| **Apps** | Array `apps` do AppShell (sempre visível) |
| **Sistema** | Apps com `category: 'system'` |
| **`<App> — Ações`** | Comandos dinâmicos da app activa (`registerCommands`) |
| **Comandos** | Prop `commands` estática do AppShell |

### Comandos dinâmicos por app

Cada app regista os seus comandos enquanto está montada. O `useEffect`
assegura a limpeza automática:

```jsx
import { useEffect, useState } from 'react';
import { useApp } from '@carloscanutocosta/core-ui/workspace';
import { Plus, Download, Filter } from 'lucide-react';

export default function DocumentsApp() {
  const { registerCommands } = useApp();
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    return registerCommands([
      {
        id:          'new-document',
        label:       'Novo Documento',
        description: 'Criar documento em branco',
        icon:        Plus,
        onSelect:    () => setShowNew(true),
      },
      {
        id:       'export-pdf',
        label:    'Exportar PDF',
        icon:     Download,
        onSelect: exportCurrentDocument,
      },
    ]);
  }, [registerCommands]); // registerCommands é estável (useCallback)
}
```

Os comandos aparecem na paleta com o cabeçalho **"Documentos — Ações"**.
Ao fechar a app (ou desmontar o componente), os comandos são removidos.

### Comandos estáticos (nível de workspace)

Para comandos globais que não pertencem a nenhuma app específica:

```jsx
<AppShell
  commands={[
    {
      id:       'open-settings',
      label:    'Abrir Definições',
      icon:     Settings,
      onSelect: () => navigate('settings'),
    },
    {
      id:       'contact-support',
      label:    'Contactar Suporte',
      onSelect: () => window.open('https://suporte.empresa.pt'),
    },
  ]}
/>
```

### Abrir programaticamente

```jsx
const { openCommand } = useApp();

<button onClick={openCommand}>
  Pesquisar (Ctrl+K)
</button>
```

### Interface `WorkspaceCommand`

```ts
interface WorkspaceCommand {
  id:           string;
  label:        string;
  description?: string;    // dica curta à direita na paleta
  icon?:        IconComponent;
  onSelect:     () => void;
}
```

---

## 10. Painel de Atendimento

Bottom-sheet multi-step para registar atendimentos sem sair do contexto
de trabalho. **O estado da sessão persiste** enquanto o workspace está
activo — o utilizador pode iniciar, consultar outras apps e voltar para concluir.

### Activar

```jsx
<AppShell
  showAtendimento={true}
  onAtendimentoSave={async (data) => {
    await api.post('/atendimentos', data);
  }}
/>
```

Para desactivar: `showAtendimento={false}`.

### Fluxo (4 passos)

| # | Título | Campos | Bloqueantes |
|---|---|---|---|
| 1 | Hora | Botão "Iniciar", canal de contacto, duração manual | "Iniciar" obrigatório |
| 2 | Identificação | Utilizador/contacto, área departamental | Utilizador e área |
| 3 | Assunto | Assunto, prioridade, descrição detalhada | Assunto |
| 4 | Resposta | Resposta/resolução, estado, notas internas, resumo | — |

### Callback `onAtendimentoSave`

Chamado com `AtendimentoData` após o utilizador clicar "Registar Atendimento":

```ts
interface AtendimentoData {
  area:                string;        // área departamental seleccionada
  assunto:             string;        // resumo do assunto (obrigatório)
  descricao:           string;        // descrição detalhada
  resposta:            string;        // resposta ou acção tomada
  canal:               string;        // canal de contacto
  prioridade:          string;        // nível de prioridade
  estado:              string;        // estado final
  utilizador_contacto: string;        // nome ou email do utilizador atendido
  duracao_minutos:     number;        // automático ou manual (minutos)
  notas_internas:      string;        // visíveis apenas para atendedores
  hora_inicio:         string | null; // ISO 8601 — momento do clique "Iniciar"
}
```

### Configurar os campos de selecção

Todos os campos de escolha têm valores padrão, mas podem ser substituídos:

```jsx
<AppShell
  atendimentoAreas={['RH', 'TI', 'Financeiro', 'Jurídico', 'Outro']}

  atendimentoCanais={[
    { label: 'Presencial', icon: Users },
    { label: 'Telefone',   icon: Phone },
    { label: 'Email',      icon: Mail  },
    { label: 'Videocall',  icon: Monitor },
  ]}

  atendimentoPrioridades={[
    { label: 'Normal',  color: 'bg-blue-500/15 text-blue-600 border-blue-500/30' },
    { label: 'Urgente', color: 'bg-red-500/15 text-red-600 border-red-500/30'   },
  ]}

  atendimentoEstados={['Aberto', 'Em Análise', 'Resolvido', 'Fechado']}
/>
```

### Valores padrão

| Campo | Padrão |
|---|---|
| `areas` | Recursos Humanos, Tecnologia, Financeiro, Jurídico, Comercial, Operações, Suporte, Outro |
| `canais` | Presencial, Telefone, Email, Chat, Portal |
| `prioridades` | Baixa (verde), Normal (azul), Alta (âmbar), Urgente (vermelho) |
| `estados` | Aberto, Em Progresso, Resolvido, Escalado, Fechado |

### Persistência de sessão

O estado do atendimento vive no `WorkspaceContext` — persiste enquanto
o workspace estiver montado. Fechar o painel não perde o progresso.
O botão na StatusBar muda para **"Atendimento em curso"** (com indicador
laranja pulsante) enquanto há uma sessão activa.

A sessão é limpa automaticamente após guardar com sucesso.

---

## 11. Painéis Direitos (Ferramentas)

Ferramentas auxiliares que abrem painéis laterais a partir do RightRail.

### Definir ferramentas e painéis

```jsx
import { Star, Calendar } from 'lucide-react';

const RIGHT_TOOLS = [
  { id: 'favorites', label: 'Favoritos',  icon: Star     },
  { id: 'calendar',  label: 'Calendário', icon: Calendar },
];

const PANELS = {
  favorites: {
    title:   'Favoritos',
    icon:    Star,
    content: <FavoritesPanel />,
  },
  calendar: {
    title:   'Calendário',
    icon:    Calendar,
    content: <CalendarPanel />,
  },
};

<AppShell rightTools={RIGHT_TOOLS} panels={PANELS} />
```

### Interface `PanelDefinition`

```ts
interface PanelDefinition {
  title:   string;
  icon?:   IconComponent;
  content: ReactNode;  // o consumidor define o conteúdo do painel
}
```

O painel abre com largura de 260px e animação de slide-in. Apenas um painel
pode estar aberto de cada vez. Clicar no mesmo botão do RightRail fecha-o.

Se `rightTools` for omitido ou vazio, o RightRail não é renderizado.

Os painéis direitos são **ocultados em mobile** (abaixo de 768px).

---

## 12. Temas WCAG

O workspace inclui 4 temas que cumprem WCAG 2.1:

| ID | Nome | Conformidade |
|---|---|---|
| `'light'` | Claro | AA |
| `'dark'` | Escuro | AA |
| `'high-contrast'` | Alto Contraste Claro | AAA |
| `'high-contrast-dark'` | Alto Contraste Escuro | AAA |

O selector está integrado no Header (ícone de tema). A escolha é persistida
em `localStorage` e restaurada automaticamente.

### Restaurar tema antes do render (evitar flash)

```js
// src/main.jsx — antes de createRoot
import { applyTheme, getStoredTheme } from '@carloscanutocosta/core-ui';
applyTheme(getStoredTheme());
```

### API programática

```js
import { applyTheme, getStoredTheme, THEMES } from '@carloscanutocosta/core-ui';

// Listar temas disponíveis
console.log(THEMES);
// [{ id: 'light', label: '...' }, { id: 'dark', label: '...' }, ...]

// Aplicar
applyTheme('high-contrast');

// Ler guardado
const current = getStoredTheme(); // 'light' | 'dark' | 'high-contrast' | 'high-contrast-dark'
```

### Dentro do workspace (componentes)

```jsx
import { useWorkspace } from '@carloscanutocosta/core-ui/workspace';

function ThemeWidget() {
  const { theme, changeTheme } = useWorkspace();
  return (
    <select value={theme} onChange={e => changeTheme(e.target.value)}>
      {THEMES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
    </select>
  );
}
```

---

## 13. Referência de Props — AppShell

| Prop | Tipo | Obrigatório | Default | Descrição |
|---|---|---|---|---|
| `apps` | `AppDefinition[]` | ✓ | — | Apps a mostrar no LeftRail |
| `children` | `(appId: string) => ReactNode` | ✓ | — | Render function das apps |
| `rightTools` | `ToolDefinition[]` | | `[]` | Ferramentas do RightRail |
| `defaultApp` | `string` | | `apps[0].id` | App aberta por defeito |
| `panels` | `Record<string, PanelDefinition>` | | `{}` | Painéis direitos |
| `logo` | `ReactNode` | | Placeholder "W" | Logo no Header |
| `appName` | `string` | | `'Workspace'` | Nome no Header |
| `user` | `{ name?, email? }` | | — | Utilizador autenticado |
| `onLogout` | `() => void` | | — | Callback de logout |
| `headerActions` | `ReactNode` | | — | Botões extra no Header |
| `notifications` | `WorkspaceNotification[]` | | `[]` | Notificações externas |
| `onNotificationRead` | `(id: string) => void` | | — | Marcar externa como lida |
| `onNotificationsReadAll` | `() => void` | | — | Marcar todas as externas como lidas |
| `onNotificationClear` | `(id?: string) => void` | | — | Remover notificação externa (sem id = limpar todas) |
| `commands` | `WorkspaceCommand[]` | | `[]` | Comandos estáticos na paleta |
| `showAtendimento` | `boolean` | | `true` | Mostrar botão de atendimento |
| `onAtendimentoSave` | `(data: AtendimentoData) => Promise<void>` | | — | Guardar atendimento |
| `atendimentoAreas` | `string[]` | | Ver §10 | Áreas configuráveis |
| `atendimentoCanais` | `{label, icon}[]` | | Ver §10 | Canais configuráveis |
| `atendimentoPrioridades` | `{label, color}[]` | | Ver §10 | Prioridades configuráveis |
| `atendimentoEstados` | `string[]` | | Ver §10 | Estados configuráveis |
| `locale` | `string` | | `'pt-PT'` | Locale para datas e horas |

---

## 14. Tipos TypeScript

Todos os tipos públicos são exportados directamente do pacote:

```ts
import type {
  AppDefinition,
  ToolDefinition,
  PanelDefinition,
  WorkspaceNotification,
  WorkspaceCommand,
  AtendimentoData,
  AppAPI,
  AppShellProps,
  IconComponent,
} from '@carloscanutocosta/core-ui/workspace';
```

### `AppDefinition`

```ts
interface AppDefinition {
  id:        string;
  label:     string;
  icon:      IconComponent;
  category?: 'core' | 'system' | string;
}
```

### `WorkspaceNotification`

```ts
interface WorkspaceNotification {
  id:           string;
  title:        string;
  description?: string;
  time?:        string;
  read?:        boolean;
  type?:        'info' | 'success' | 'warning' | 'error';
}
```

### `WorkspaceCommand`

```ts
interface WorkspaceCommand {
  id:           string;
  label:        string;
  description?: string;
  icon?:        IconComponent;
  onSelect:     () => void;
}
```

### `PanelDefinition`

```ts
interface PanelDefinition {
  title:   string;
  icon?:   IconComponent;
  content: ReactNode;
}
```

### `AtendimentoData`

```ts
interface AtendimentoData {
  area:                string;
  assunto:             string;
  descricao:           string;
  resposta:            string;
  canal:               string;
  prioridade:          string;
  estado:              string;
  utilizador_contacto: string;
  duracao_minutos:     number;
  notas_internas:      string;
  hora_inicio:         string | null;
}
```

### `AppAPI` — retorno de `useApp()`

```ts
interface AppAPI {
  appId:            string;
  params:           unknown;
  navigate:         (appId: string, params?: unknown) => void;
  notify:           (n: Omit<WorkspaceNotification, 'id'>) => void;
  setBadge:         (count: number) => void;
  registerCommands: (cmds: WorkspaceCommand[]) => () => void;
  openCommand:      () => void;
}
```

---

## 15. Composição Avançada

Para layouts personalizados que não se encaixam no `AppShell`, os
componentes individuais estão disponíveis.

### Componentes exportados

| Export | Componente |
|---|---|
| `WorkspaceProvider` | Context provider — deve envolver todos os outros |
| `useWorkspace` | Hook de acesso ao contexto interno |
| `AppShell` | Shell completa (todos os componentes) |
| `WorkspaceHeader` | Header com logo, pesquisa, notificações, tema, user |
| `LeftRail` | Navegação lateral esquerda |
| `RightRail` | Botões de ferramentas direitos |
| `RightPanel` | Painel de conteúdo direito |
| `WorkspaceTabBar` | Barra de tabs |
| `WorkspaceContentArea` | Área de conteúdo com gestão de tabs |
| `WorkspaceStatusBar` | Barra de estado (fundo) |
| `AtendimentoPanel` | Painel de registo de atendimento (standalone) |
| `WorkspaceCommandPalette` | Paleta de comandos |
| `WorkspaceNotificationsPanel` | Painel de notificações (standalone) |

### Layout personalizado

```jsx
import {
  WorkspaceProvider,
  WorkspaceHeader,
  LeftRail,
  WorkspaceContentArea,
  WorkspaceStatusBar,
  WorkspaceCommandPalette,
} from '@carloscanutocosta/core-ui/workspace';

export default function CustomLayout({ apps, children }) {
  return (
    <WorkspaceProvider apps={apps} defaultApp="dashboard">
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        <WorkspaceHeader appName="Portal" user={user} onLogout={logout} />
        <div className="flex-1 flex overflow-hidden">
          <LeftRail />
          <WorkspaceContentArea>
            {children}
          </WorkspaceContentArea>
        </div>
        <WorkspaceStatusBar user={user} onAtendimentoSave={save} />
        <WorkspaceCommandPalette />
      </div>
    </WorkspaceProvider>
  );
}
```

### `useWorkspace()` — acesso completo ao contexto

Usar em componentes de layout/shell. Para componentes de apps, preferir `useApp()`.

```jsx
import { useWorkspace } from '@carloscanutocosta/core-ui/workspace';

function MyWidget() {
  const {
    activeApp,          // string | null — app activa
    openTabs,           // { id, label }[] — tabs abertas
    theme,              // string — tema activo
    appBadges,          // Record<string, number> — badges por app
    openApp,            // (appId, params?) => void
    closeTab,           // (tabId) => void
    changeTheme,        // (id) => void
    openCommand,        // () => void
    openMobileRail,     // () => void
  } = useWorkspace();
}
```

---

## 16. Exemplos Completos

### App com todas as funcionalidades de integração

```jsx
import { useEffect, useState } from 'react';
import { useApp } from '@carloscanutocosta/core-ui/workspace';
import { Plus, Download, RefreshCw } from 'lucide-react';

export default function TasksApp() {
  const { navigate, notify, setBadge, registerCommands } = useApp();
  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);

  // Carregar tarefas ao montar
  useEffect(() => {
    fetchTasks().then(data => { setTasks(data); setLoading(false); });
  }, []);

  // Actualizar badge com tarefas pendentes
  useEffect(() => {
    setBadge(tasks.filter(t => t.status === 'pending').length);
  }, [tasks, setBadge]);

  // Registar comandos na paleta (Ctrl+K)
  useEffect(() => {
    return registerCommands([
      { id: 'new-task',    label: 'Nova Tarefa',       icon: Plus,       onSelect: () => setShowNew(true)   },
      { id: 'export',      label: 'Exportar CSV',       icon: Download,   onSelect: exportToCSV              },
      { id: 'refresh',     label: 'Actualizar lista',   icon: RefreshCw,  onSelect: () => fetchTasks().then(setTasks) },
    ]);
  }, [registerCommands]);

  const handleCreate = async (data) => {
    try {
      const task = await createTask(data);
      setTasks(prev => [...prev, task]);
      notify({ title: 'Tarefa criada', description: task.title, type: 'success' });
    } catch (err) {
      notify({ title: 'Erro ao criar tarefa', description: err.message, type: 'error' });
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <button onClick={() => setShowNew(true)}>Nova Tarefa</button>
      </div>
      <TaskList tasks={tasks} onNavigateToDashboard={() => navigate('dashboard', { widget: 'tasks' })} />
      {showNew && <NewTaskDialog onSave={handleCreate} onClose={() => setShowNew(false)} />}
    </div>
  );
}
```

### Setup completo do AppShell

```jsx
import { useState } from 'react';
import { AppShell } from '@carloscanutocosta/core-ui/workspace';
import { LayoutDashboard, FileText, CheckSquare, Settings, Star, Calendar, Phone, Mail, Users } from 'lucide-react';

import DashboardApp from './apps/DashboardApp';
import DocumentsApp from './apps/DocumentsApp';
import TasksApp     from './apps/TasksApp';
import SettingsApp  from './apps/SettingsApp';

const APPS = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard, category: 'core'   },
  { id: 'documents', label: 'Documentos', icon: FileText,         category: 'core'   },
  { id: 'tasks',     label: 'Tarefas',    icon: CheckSquare,      category: 'core'   },
  { id: 'settings',  label: 'Definições', icon: Settings,         category: 'system' },
];

const RIGHT_TOOLS = [
  { id: 'favorites', label: 'Favoritos',  icon: Star     },
  { id: 'calendar',  label: 'Calendário', icon: Calendar },
];

const PANELS = {
  favorites: { title: 'Favoritos',  icon: Star,     content: <FavoritesPanel /> },
  calendar:  { title: 'Calendário', icon: Calendar, content: <CalendarPanel  /> },
};

const APP_MAP = {
  dashboard: <DashboardApp />,
  documents: <DocumentsApp />,
  tasks:     <TasksApp />,
  settings:  <SettingsApp />,
};

export default function WorkspaceRoot() {
  const [notifications, setNotifications] = useState([]);

  return (
    <AppShell
      apps={APPS}
      rightTools={RIGHT_TOOLS}
      panels={PANELS}
      appName="Portal Interno"
      user={auth.currentUser}
      onLogout={auth.logout}

      notifications={notifications}
      onNotificationRead={(id) =>
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
      }
      onNotificationsReadAll={() =>
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      }
      onNotificationClear={(id) =>
        setNotifications(prev => id ? prev.filter(n => n.id !== id) : [])
      }

      showAtendimento
      onAtendimentoSave={async (data) => {
        await api.post('/atendimentos', data);
        analytics.track('atendimento_registado', { area: data.area });
      }}
      atendimentoAreas={['RH', 'TI', 'Financeiro', 'Outro']}
      atendimentoCanais={[
        { label: 'Presencial', icon: Users },
        { label: 'Telefone',   icon: Phone },
        { label: 'Email',      icon: Mail  },
      ]}
    >
      {(appId) => APP_MAP[appId] ?? null}
    </AppShell>
  );
}
```

---

## 17. Tooling de Desenvolvimento

Esta secção destina-se a contribuidores e ao autor do SDK.

### Pré-requisitos

```bash
node >= 18   # verificar com: node -v
pnpm >= 9    # verificar com: pnpm -v
```

Instalar dependências:

```bash
pnpm install
```

### Servidor de desenvolvimento

Executa a demo interactiva em `http://localhost:5173`:

```bash
pnpm dev
# → /workspace    demonstração do Workspace SDK
# → /             playground de todos os componentes
```

### Storybook

O Storybook fornece um catálogo visual e interactivo de todos os componentes
do SDK com controlos de props, verificação de acessibilidade (axe) e
documentação automática de props (autodocs).

**Arrancar o servidor de desenvolvimento:**

```bash
pnpm storybook
# → http://localhost:6006
```

**Navegar pelas stories:**

| Grupo | Componentes |
|---|---|
| **UI** | Button (7 variantes), Badge (4 variantes) |
| **Display** | TextDisplay, BadgeDisplay, NumberDisplay, DateDisplay, ProgressDisplay, RichTextDisplay |
| **Charts** | AreaChart, BarChart, LineChart, PieChart, Heatmap, Sparkline |
| **Forms/Inputs** | TextInput, NumberInput, SelectInput, SliderInput, SwitchInput, CheckboxInput, RatingInput, TagsInput, PasswordInput, MultiSelectInput, SearchInput, OTPInput |
| **Forms/Fields** | TextField e variantes (multiline, prefix, suffix) |
| **Data** | StatCard, AlertBanner, Breadcrumbs, Stepper, Timeline, DataTable, ListView |
| **Layout** | SidebarLayout, TopNavbar |
| **UI Extra** | AvatarGroup, CodeBlock, EmptyState, ConfirmDialog, NotificationCenter, ImageGallery |
| **Workspace** | AppShell, AtendimentoPanel, LeftRail, NotificationsPanel, WorkspaceCommandPalette |

Cada story tem:
- **Controls** — ajustar props em tempo real;
- **A11y** — resultado de auditoria axe automático por story;
- **Docs** — documentação de props gerada automaticamente (autodocs).

O Storybook é publicado automaticamente no **Chromatic** a cada push para `devel`/`main`.

**Publicar Storybook estático (CI/GitHub Pages):**

```bash
pnpm storybook:build
# output: storybook-static/
```

**Adicionar uma nova story:**

Criar `src/components/ui/MyComponent.stories.jsx` (ou `.tsx`):

```jsx
import { MyComponent } from './MyComponent';

export default {
  title: 'UI/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
};

export const Default = { args: { label: 'Olá' } };
```

A story aparece automaticamente no Storybook sem mais configuração.

---

### Testes

O projecto usa **Vitest** + **@testing-library/react** + **jest-axe** (acessibilidade).

**Executar todos os testes:**

```bash
pnpm test
```

**Modo watch (re-executa em cada alteração):**

```bash
pnpm test:watch
```

**Relatório de cobertura (text + HTML + lcov):**

```bash
pnpm test:coverage
# output: coverage/
```

**Estrutura dos testes:**

```
src/test/
  setup.js                    — mocks globais (matchMedia, ResizeObserver, IntersectionObserver)
  lib/                        — utils, theme, query-client
  hooks/                      — use-app, use-mobile
  workspace/                  — WorkspaceContext (57 testes), AppShell, Header, LeftRail,
                                RightPanel, RightRail, TabBar, StatusBar, AtendimentoPanel,
                                ContentArea, NotificationsPanel, WorkspaceCommandPalette
  display/                    — TextDisplay, BadgeDisplay, NumberDisplay, DateDisplay,
                                ProgressDisplay, RichTextDisplay (render + axe)
  charts/                     — AreaChart, BarChart, LineChart, PieChart, Heatmap, Sparkline
  forms/
    inputs.test.jsx           — TextInput, NumberInput, SelectInput, SliderInput,
                                SwitchInput, CheckboxInput, RatingInput, TagsInput,
                                PasswordInput, MultiSelectInput, SearchInput, OTPInput
    fields.test.jsx           — TextField, SelectField (render + axe)
  data/                       — StatCard, AlertBanner, Breadcrumbs, Stepper, Timeline,
                                DataTable, ListView (render + interactions + axe)
```

**Total: 358 testes em 21 suites, 0 falhas.**

**Escrever um novo teste:**

```jsx
// src/test/components/MyComponent.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import MyComponent from '@/components/MyComponent';

expect.extend(toHaveNoViolations);

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent label="Teste" />);
    expect(screen.getByText('Teste')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<MyComponent label="Teste" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

**Thresholds de cobertura (enforçados no CI para workspace/hooks/lib):**

| Métrica | Mínimo |
|---|---|
| Linhas | 80% |
| Funções | 70% |
| Branches | 75% |

---

*Normordis Core UI — Workspace SDK · Documentação Técnica*
