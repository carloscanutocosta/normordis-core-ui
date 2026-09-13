# @carloscanutocosta/core-ui

SDK React de componentes, tokens e padrões UX reutilizáveis para aplicações do ecossistema NORMORDIS.

Baseado em [Radix UI](https://www.radix-ui.com/), [Tailwind CSS](https://tailwindcss.com/) e [shadcn/ui](https://ui.shadcn.com/). Inclui formulários, tabelas, charts, editor rich text, layout e mais de 100 componentes prontos a usar.

---

## Instalação

```bash
pnpm add @carloscanutocosta/core-ui
```

### Peer dependencies obrigatórias

O SDK usa estas dependências mas não as inclui no bundle — o teu projecto precisa de as ter instaladas:

```bash
pnpm add react react-dom lucide-react date-fns \
  @radix-ui/react-accordion @radix-ui/react-alert-dialog \
  @radix-ui/react-avatar @radix-ui/react-checkbox \
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  @radix-ui/react-label @radix-ui/react-popover \
  @radix-ui/react-progress @radix-ui/react-radio-group \
  @radix-ui/react-select @radix-ui/react-separator \
  @radix-ui/react-slider @radix-ui/react-slot \
  @radix-ui/react-switch @radix-ui/react-tabs \
  @radix-ui/react-toast @radix-ui/react-toggle \
  @radix-ui/react-toggle-group @radix-ui/react-tooltip \
  @tanstack/react-query
```

### CSS

Importa a stylesheet do SDK uma vez no entry point da tua aplicação:

```js
import '@carloscanutocosta/core-ui/styles.css'
```

---

## Quickstart

```jsx
import { TextField, SelectField, NumberField, Button } from '@carloscanutocosta/core-ui'
import '@carloscanutocosta/core-ui/styles.css'

export function ExemploFormulario() {
  return (
    <div className="space-y-4 max-w-md">
      <TextField label="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
      <NumberField label="Quantidade" value={qty} onChange={setQty} min={1} max={100} />
      <SelectField
        label="Estado"
        options={['Activo', 'Inactivo', 'Pendente']}
        value={estado}
        onChange={setEstado}
      />
      <Button type="submit">Guardar</Button>
    </div>
  )
}
```

---

## Componentes

### Formulários — família `*Field`

Componentes com label, hint, erro e acessibilidade integrados.

| Componente | Descrição |
|---|---|
| `TextField` | Input de texto, suporta `multiline`, `prefix`, `suffix`, `readOnly` |
| `NumberField` | Input numérico com controlos +/– integrados |
| `SelectField` | Dropdown com opções normalizadas |
| `DateField` | Picker de data (e hora com `showTime`) |
| `SwitchField` | Toggle on/off com label lateral |
| `TagsField` | Input de tags com sugestões e `maxTags` |
| `CheckboxField` | Checkbox com label e hint |
| `RadioField` | Grupo de rádio |
| `SliderField` | Slider com range configurável |
| `RichTextField` | Editor rich text (requer `react-quill-new`) |
| `ColorField` | Picker de cor |
| `DisplayField` | Campo só de leitura estilizado |
| `FileUploadField` | Upload de ficheiros com drag & drop |
| `ProgressField` | Barra de progresso |
| `RatingField` | Avaliação por estrelas |
| `SpinnerField` | Indicador de carregamento |
| `FieldWrapper` | Wrapper base para construir campos personalizados |

### Formulários — família `*Input`

Componentes de input standalone (sem FieldWrapper interno).

`TextInput` · `NumberInput` · `TextAreaInput` · `DateInput` · `DateTimeInput` · `SelectInput` · `MultiSelectInput` · `CheckboxInput` · `SwitchInput` · `RadioGroupInput` · `SliderInput` · `TagsInput` · `PasswordInput` · `SearchInput` · `ColorInput` · `OTPInput` · `RatingInput` · `PhoneInput` · `CurrencyInput` · `TimeRangeInput` · `ToggleGroupInput` · `MaskedInput` · `AddressInput` · `ImageCropInput` · `SignaturePad` · `FileUploadInput`

### Apresentação

| Componente | Descrição |
|---|---|
| `RichTextDisplay` | Renderiza HTML sanitizado (DOMPurify) |
| `TextDisplay` | Texto formatado |
| `NumberDisplay` | Número formatado |
| `DateDisplay` | Data formatada |
| `BadgeDisplay` | Badge com variantes de cor |
| `ProgressDisplay` | Barra de progresso de leitura |

### Dados

`DataTable` · `DataGrid` · `KanbanBoard` · `CalendarView` · `GanttChart` · `TreeView` · `ListView` · `Timeline` · `Stepper` · `StatCard` · `FilterPanel` · `AccordionMenu` · `MapView`¹ · `PDFConfigModal` · `RecordModal` · `ExportButton` · `AlertBanner` · `Breadcrumbs`

> ¹ `MapView` requer `react-leaflet` e `leaflet` instalados, e `import 'leaflet/dist/leaflet.css'` no entry point.

### Menus

`HamburgerMenu` · `KebabMenu` · `MeatballMenu` · `DropdownWithSubmenu` · `SpeedDial`

### Charts

Requerem `recharts` instalado.

`AreaChart` · `BarChart` · `LineChart` · `PieChart` · `Heatmap` · `Sparkline`

### Editor Rich Text

Requerem `lexical` e `@lexical/react` instalados.

| Componente | Descrição |
|---|---|
| `NormordisEditorLexical` | Editor Lexical completo com toolbar |
| `DocumentEditor` | Editor de documento com suporte a placeholders |
| `RichTextInput` | Editor simples (defaultValue pattern) |

### Layout

| Componente | Descrição |
|---|---|
| `SidebarLayout` | Layout com sidebar colapsável e navegação |
| `TopNavbar` | Barra de navegação superior |

### UI Extra

`AvatarGroup` · `CodeBlock` · `CommandPalette` · `ConfirmDialog` · `DragDropList` · `EmptyState` · `ImageGallery` · `NotificationCenter` · `ThemeSwitcher`

---

## Peer dependencies opcionais

Instala apenas o que usares:

| Feature | Pacotes a instalar |
|---|---|
| Charts | `recharts` |
| Editor Lexical | `lexical @lexical/react` |
| MapView | `react-leaflet leaflet` |
| WorkspaceCommandPalette | `cmdk` |
| Formulários com validação | `react-hook-form @hookform/resolvers zod` |
| Tabelas avançadas | `@tanstack/react-table` |
| Drag & drop | `@hello-pangea/dnd` |
| Animações | `framer-motion` |
| Export PDF | `html2canvas jspdf` |
| Markdown | `react-markdown` |

> A partir da v2.0.0, `recharts` requer `>=3.0.0` e `react-day-picker` requer
> `>=9.0.0` (mínimos anteriores: `>=2.0.0` e `>=8.10.0`) — versões mais antigas
> deixaram de ser suportadas. A partir da v2.0.1, `RichTextField` usa
> `react-quill-new` em vez de `react-quill` (o original não monta sob React
> 19). Ver `CHANGELOG.md`.

---

## Tema e estilos

O SDK usa variáveis CSS do Tailwind e suporta temas **claro**, **escuro** e **alto contraste**. Para activar o tema escuro, adiciona a classe `dark` no elemento `<html>`.

```html
<html class="dark">
```

Para usar o `ThemeSwitcher` incluído:

```jsx
import { ThemeSwitcher } from '@carloscanutocosta/core-ui'
// Coloca no teu header ou navbar
<ThemeSwitcher />
```

### Configurar o Tailwind do teu projecto para processar as classes do SDK

O SDK usa internamente Tailwind CSS 4, mas isso é independente da versão do
Tailwind da tua app — segue o procedimento correspondente à tua versão:

```js
// Tailwind v3 — tailwind.config.js
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@carloscanutocosta/core-ui/dist/**/*.js',
  ],
}
```

```css
/* Tailwind v4 — CSS de entrada (node_modules já não é varrido automaticamente) */
@import 'tailwindcss';
@source '../node_modules/@carloscanutocosta/core-ui/dist';
```

Sem isto, os componentes do SDK renderizam sem estilos. Detalhe completo,
incluindo como reaproveitar o `tailwind.config.js` publicado pelo pacote como
preset/config legada, em `docs/PUBLISHING.md`.

---

## Desenvolvimento

Requer Node.js 24.x e pnpm 11.x.

```bash
pnpm install
pnpm dev          # app de showcase
pnpm run build    # build do SDK (dist/)
```

Em servidor ou via Remote-SSH, `pnpm run demo` arranca sem tentar abrir um
browser. Num Linux desktop, usa `pnpm run demo -- --open`.

### Scripts de utilidade

```bash
node scripts/check-exports.mjs          # detectar colisões de nomes no barrel
node scripts/check-missing-exports.mjs  # componentes sem export público
pnpm run check                          # higiene, documentação, lint, tipos e build
```

Os fluxos operacionais estão separados por shell: `scripts/bash/` contém as
entradas principais e `scripts/powershell/` mantém as variantes Windows. Os
utilitários Node independentes do shell permanecem diretamente em `scripts/`.
Em Linux, `pnpm run backup` guarda por omissão em
`/mnt/normordis-backup/backups/repos/core-ui` e exclui secrets locais (`.env*`,
`*.pem` e `*.key`). O destino pode ser substituído com `--dest-dir` ou com a
variável `NORMORDIS_BACKUP_DIR`.

`pnpm run backup:cloud` copia os ZIP para
`gdrive:backups/projetos/core-ui` através de `rclone`. A cópia é deliberadamente
não cifrada e mantém os 5 snapshots mais recentes no SSD e no Google Drive.
Antes do primeiro envio, pode ser simulada com
`pnpm run backup:cloud -- --dry-run`.

No servidor NORMORDIS, o timer `normordis-core-ui-backup.timer` executa
diariamente o backup local e, após sucesso, a cópia Google Drive. Os templates
das units vivem em `scripts/systemd/` e os logs em
`/srv/normordis/logs/backups/core-ui-backup.log`.
O log é abrangido pela política central `/etc/logrotate.d/normordis`: rotação
semanal, 8 rotações, compressão e `delaycompress`.

---

## Responsabilidade

Este pacote fornece uma **camada de apresentação** partilhada. Não deve conter regras de negócio, persistência, autenticação de uma app concreta, integrações Tauri/backend, nem workflows institucionais. Exemplos e showcases existem no repositório mas não fazem parte do contrato público do SDK.

---

## Licença

Licenciado sob [EUPL-1.2](./LICENSE). As contribuições e trabalhos derivados
distribuídos devem respeitar os termos de reciprocidade da licença.
