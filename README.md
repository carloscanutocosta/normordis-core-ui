# @normordis/core-ui

SDK React de componentes, tokens e padrões UX reutilizáveis para aplicações do ecossistema NORMORDIS.

Baseado em [Radix UI](https://www.radix-ui.com/), [Tailwind CSS](https://tailwindcss.com/) e [shadcn/ui](https://ui.shadcn.com/). Inclui formulários, tabelas, charts, editor rich text, layout e mais de 100 componentes prontos a usar.

---

## Instalação

```bash
pnpm add @normordis/core-ui
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
import '@normordis/core-ui/dist/normordis-core-ui.css'
```

---

## Quickstart

```jsx
import { TextField, SelectField, NumberField, Button } from '@normordis/core-ui'
import '@normordis/core-ui/dist/normordis-core-ui.css'

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
| `RichTextField` | Editor rich text (requer `react-quill`) |
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

---

## Tema e estilos

O SDK usa variáveis CSS do Tailwind e suporta temas **claro**, **escuro** e **alto contraste**. Para activar o tema escuro, adiciona a classe `dark` no elemento `<html>`.

```html
<html class="dark">
```

Para usar o `ThemeSwitcher` incluído:

```jsx
import { ThemeSwitcher } from '@normordis/core-ui'
// Coloca no teu header ou navbar
<ThemeSwitcher />
```

---

## Desenvolvimento

Requer Node.js 24.x e pnpm 11.x.

```bash
pnpm install
pnpm dev          # app de showcase
pnpm run build    # build do SDK (dist/)
```

### Scripts de utilidade

```bash
node scripts/check-exports.mjs          # detectar colisões de nomes no barrel
node scripts/check-missing-exports.mjs  # componentes sem export público
```

---

## Responsabilidade

Este pacote fornece uma **camada de apresentação** partilhada. Não deve conter regras de negócio, persistência, autenticação de uma app concreta, integrações Tauri/backend, nem workflows institucionais. Exemplos e showcases existem no repositório mas não fazem parte do contrato público do SDK.

---

## Licença

Privado — uso exclusivo no ecossistema NORMORDIS.
