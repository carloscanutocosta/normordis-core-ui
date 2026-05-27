# MAN_WORKSPACE — AppShell e Workspace

Referência para consumidores que integrem a shell institucional do `core-ui`
nas suas aplicações.

---

## Conceito

O `AppShell` é a shell de layout standard para aplicações do ecossistema
NORMORDIS. Fornece estrutura, navegação, tema e estado partilhado, deixando
ao consumidor o controlo total sobre o conteúdo de cada app.

```
┌─────────────────────────────────────────────────┐
│  WorkspaceHeader  (logo · pesquisa · tema · user) │
├──────┬──────────────────────────────┬─────┬──────┤
│      │  TabBar (tabs das apps)      │     │      │
│ Left │──────────────────────────────│Right│Right │
│ Rail │  ContentArea                 │Panel│ Rail │
│      │  (children / render fn)      │     │      │
├──────┴──────────────────────────────┴─────┴──────┤
│  WorkspaceStatusBar  (online · user · relógio)   │
└─────────────────────────────────────────────────┘
```

Cada **app** é um componente React normal. O `AppShell` não sabe nada sobre
o conteúdo — recebe `children` como render function que devolve o componente
certo para a app activa.

---

## Instalação e pré-requisitos

Ver `docs/PUBLISHING.md` para instalar o pacote e configurar o Tailwind.

O `AppShell` usa `framer-motion` para animações — deve ser peer dep instalada
no projecto consumidor:

```bash
pnpm add framer-motion
```

---

## Uso mínimo

```jsx
// main.jsx
import '@carloscanutocosta/core-ui/dist/normordis-core-ui.css'
import { applyTheme, getStoredTheme } from '@carloscanutocosta/core-ui'

// Restaurar tema guardado antes de renderizar
applyTheme(getStoredTheme())
```

```jsx
// App.jsx
import { AppShell } from '@carloscanutocosta/core-ui'
import { LayoutDashboard, FileText, Settings } from 'lucide-react'
import Dashboard from './apps/Dashboard'
import Documents from './apps/Documents'
import AppSettings from './apps/AppSettings'

const APPS = [
  { id: 'dashboard', label: 'Dashboard',   icon: LayoutDashboard, category: 'core' },
  { id: 'documents', label: 'Documentos',  icon: FileText,        category: 'core' },
  { id: 'settings',  label: 'Definições',  icon: Settings,        category: 'system' },
]

const APP_MAP = {
  dashboard: Dashboard,
  documents: Documents,
  settings:  AppSettings,
}

export default function App() {
  const user = { name: 'João Silva', email: 'joao@example.com' }

  return (
    <AppShell
      apps={APPS}
      appName="A minha app"
      user={user}
      onLogout={() => auth.logout()}
      onAtendimentoSave={async (data) => await api.saveAtendimento(data)}
    >
      {(activeApp) => {
        const Component = APP_MAP[activeApp]
        return Component ? <Component /> : null
      }}
    </AppShell>
  )
}
```

---

## Definir apps

Cada entrada no array `apps` descreve uma app da navegação lateral:

```ts
type App = {
  id:       string            // identificador único, usado no render function
  label:    string            // texto no LeftRail e nas tabs
  icon:     LucideComponent   // ícone importado de lucide-react
  category: string            // 'system' vai para baixo do separador; qualquer outro valor fica em cima
}
```

```jsx
import { LayoutDashboard, Settings } from 'lucide-react'

const APPS = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard, category: 'core'   },
  { id: 'settings',  label: 'Definições', icon: Settings,        category: 'system' },
]
```

---

## Construir uma app para o workspace

Uma app é um **componente React comum** — não tem dependência do workspace.
É apenas o que vai renderizar dentro da `ContentArea` quando essa app estiver activa.

```jsx
// apps/Dashboard.jsx
export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {/* conteúdo da app */}
    </div>
  )
}
```

O `AppShell` passa o `id` da app activa para a render function de `children`.
O consumidor decide como mapear esse id para o componente:

```jsx
// mapeamento simples
{(activeApp) => {
  if (activeApp === 'dashboard') return <Dashboard />
  if (activeApp === 'documents') return <Documents />
  return null
}}

// ou com React.lazy para code splitting
const Dashboard = lazy(() => import('./apps/Dashboard'))

{(activeApp) => (
  <Suspense fallback={<div className="p-6 text-muted-foreground">A carregar...</div>}>
    {activeApp === 'dashboard' && <Dashboard />}
    {activeApp === 'documents' && <Documents />}
  </Suspense>
)}
```

---

## Aceder ao estado do workspace dentro de uma app

Componentes dentro do `AppShell` podem chamar `useWorkspace()` para ler ou
alterar o estado da shell:

```jsx
import { useWorkspace } from '@carloscanutocosta/core-ui'

export default function Dashboard() {
  const { activeApp, openApp, theme, changeTheme } = useWorkspace()

  return (
    <div className="p-6">
      <p>App activa: {activeApp}</p>
      <button onClick={() => openApp('documents')}>
        Ir para Documentos
      </button>
    </div>
  )
}
```

### O que está disponível em `useWorkspace()`

| Propriedade / Método       | Tipo                      | Descrição                                 |
|----------------------------|---------------------------|-------------------------------------------|
| `apps`                     | `App[]`                   | Lista de apps registadas                  |
| `rightTools`               | `Tool[]`                  | Lista de ferramentas do rail direito      |
| `activeApp`                | `string`                  | Id da app actualmente visível             |
| `openTabs`                 | `{ id, label }[]`         | Tabs abertas na TabBar                    |
| `activeTool`               | `string \| null`          | Ferramenta activa no rail direito         |
| `leftRailCollapsed`        | `boolean`                 | Estado colapsado do rail esquerdo         |
| `rightPanelOpen`           | `boolean`                 | Painel direito visível                    |
| `theme`                    | `string`                  | Tema activo (`light`, `dark`, …)          |
| `openApp(id)`              | `(string) => void`        | Abre app e adiciona tab                   |
| `closeTab(id)`             | `(string) => void`        | Fecha uma tab                             |
| `setActiveApp(id)`         | `(string) => void`        | Muda app activa sem adicionar tab         |
| `toggleTool(id)`           | `(string) => void`        | Abre/fecha ferramenta no rail direito     |
| `setLeftRailCollapsed(v)`  | `(boolean) => void`       | Colapsa/expande rail esquerdo             |
| `changeTheme(id)`          | `(string) => void`        | Muda tema e persiste em localStorage      |

---

## Painel "Registar Atendimento"

O botão na `WorkspaceStatusBar` abre o `AtendimentoPanel` — um wizard
multi-step que desliza de baixo para cima. O consumidor é responsável por
persistir o registo via `onAtendimentoSave`:

```jsx
<AppShell
  ...
  showAtendimento={true}
  onAtendimentoSave={async (data) => {
    await fetch('/api/atendimentos', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }}
>
```

O objecto `data` passado ao callback contém:

```ts
{
  area:                 string   // ex: 'Tecnologia'
  assunto:              string
  descricao:            string
  resposta:             string
  canal:                string   // 'Presencial' | 'Telefone' | 'Email' | 'Chat' | 'Portal'
  prioridade:           string   // 'Baixa' | 'Normal' | 'Alta' | 'Urgente'
  estado:               string   // 'Aberto' | 'Em Progresso' | 'Resolvido' | 'Escalado' | 'Fechado'
  utilizador_contacto:  string
  duracao_minutos:      number
  notas_internas:       string
  hora_inicio:          string   // ISO 8601
}
```

Para desactivar o painel: `showAtendimento={false}`.

---

## Rails direitos (RightRail + RightPanel)

Para adicionar ferramentas no rail direito, define `rightTools` e `panels`:

```jsx
import { Star, Calendar } from 'lucide-react'

const RIGHT_TOOLS = [
  { id: 'favorites', label: 'Favoritos',  icon: Star     },
  { id: 'calendar',  label: 'Calendário', icon: Calendar },
]

const PANELS = {
  favorites: {
    title:   'Favoritos',
    icon:    Star,
    content: <FavoritesPanel />,   // ReactNode — o consumidor define o conteúdo
  },
  calendar: {
    title:   'Calendário',
    icon:    Calendar,
    content: <CalendarPanel />,
  },
}

<AppShell
  apps={APPS}
  rightTools={RIGHT_TOOLS}
  panels={PANELS}
  ...
>
```

Se `rightTools` for omitido ou vazio, o rail direito não é renderizado.

---

## Temas (4 variantes WCAG)

O `WorkspaceHeader` inclui um selector de tema com as 4 variantes do core-ui:

| Id                   | Aparência                          | WCAG    |
|----------------------|------------------------------------|---------|
| `light`              | Claro (default)                    | AA ✓    |
| `dark`               | Escuro                             | AA ✓    |
| `high-contrast`      | Alto contraste claro               | AAA ✓   |
| `high-contrast-dark` | Alto contraste escuro              | AAA ✓   |

O tema é persistido em `localStorage` e restaurado automaticamente pelo
`WorkspaceProvider`. Para restaurar o tema antes da primeira renderização
(evitar flash), chama `applyTheme(getStoredTheme())` no entry point da app,
antes do `ReactDOM.createRoot`.

---

## Props completas do AppShell

```ts
type AppShellProps = {
  apps:                App[]                          // obrigatório
  rightTools?:         Tool[]                         // default []
  defaultApp?:         string                         // default apps[0].id
  panels?:             Record<string, PanelDef>       // default {}
  logo?:               ReactNode                      // default ícone "W"
  appName?:            string                         // default "Workspace"
  user?:               { name?: string; email?: string }
  onLogout?:           () => void
  onSearch?:           () => void                     // omitir esconde a barra de pesquisa
  headerActions?:      ReactNode                      // botões extra no header
  showAtendimento?:    boolean                        // default true
  onAtendimentoSave?:  (data: AtendimentoData) => Promise<void>
  locale?:             string                         // default 'pt-PT'
  children:            ReactNode | ((activeApp: string) => ReactNode)
}
```

---

## Uso avançado: shell sem AppShell

Se precisares de compor a shell manualmente (ex: layout diferente), podes
usar os componentes individualmente. O `WorkspaceProvider` deve envolver todos:

```jsx
import {
  WorkspaceProvider,
  WorkspaceHeader,
  LeftRail,
  WorkspaceContentArea,
  WorkspaceStatusBar,
} from '@carloscanutocosta/core-ui'

<WorkspaceProvider apps={APPS} defaultApp="dashboard">
  <div className="h-screen flex flex-col">
    <WorkspaceHeader appName="Custom" user={user} onLogout={logout} />
    <div className="flex-1 flex overflow-hidden">
      <LeftRail />
      <WorkspaceContentArea>
        {(activeApp) => <AppRouter activeApp={activeApp} />}
      </WorkspaceContentArea>
    </div>
    <WorkspaceStatusBar user={user} onAtendimentoSave={save} />
  </div>
</WorkspaceProvider>
```
