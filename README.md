# normordis-core-ui

SDK React de componentes, tokens e padrões UX reutilizáveis para aplicações do
ecossistema NORMORDIS.

## Responsabilidade

Este pacote fornece uma camada de apresentação partilhada:

- primitivas de UI baseadas em React, Radix UI e Tailwind;
- componentes de formulários, dados, charts, layout e apresentação;
- temas claro, escuro e alto contraste;
- utilitários pequenos para composição visual.

## Não responsabilidade

Este pacote não deve conter regras de negócio, persistência, autenticação de uma
app concreta, integrações Tauri/backend, nem workflows institucionais
completos. Exemplos e showcases podem existir no repositório, mas não fazem parte
do contrato público do SDK.

## Uso

```bash
npm install @normordis/core-ui
```

```jsx
import { Button, TextInput } from "@normordis/core-ui";
import "@normordis/core-ui/styles.css";

export function Example() {
  return (
    <form className="space-y-4">
      <TextInput label="Nome" placeholder="Nome completo" />
      <Button type="submit">Guardar</Button>
    </form>
  );
}
```

## Desenvolvimento

Este projeto fixa Node.js 24 e pnpm 10. Se usares `nvm`, corre:

```bash
nvm use
```

```bash
corepack enable
pnpm install
pnpm run lint
pnpm run typecheck
pnpm run build
```

### Scripts de manutenção

Os scripts PowerShell em `scripts/` automatizam validação, build e cópias de
segurança do repositório:

```bash
pnpm run check
pnpm run check:repo
pnpm run check:docs
pnpm run build:debug
pnpm run build:release
pnpm run pack:inspect
pnpm run security:manifest
pnpm run security:verify
pnpm run backup
pnpm run restore:list
```

O backup usa por defeito `D:\Backup\normordis-core-ui` e cria snapshots ZIP sem
artefactos reconstruíveis como `node_modules`, `dist`, caches e logs. Para
restaurar, usar `scripts/backup/full-repo-restore.ps1` com `-RestoreDir`.

Os comandos em `scripts/` são a fachada operacional. A pasta `tools/` contém
helpers reutilizáveis para higiene do repositório, documentação, inspeção do
pacote e acessibilidade.

A baseline de segurança vive em `security/` e nos workflows `CI`, `Trust`,
`Trust Baseline` e `Release`. A release gera pacote `.tgz`, manifest e
evidência de provenance; publicação npm automática só deve ser ativada depois de
configurar trusted publishing/OIDC no npm.

## Estado atual

Este repositório começou como uma app/showcase Vite. A base
visual foi mantida, mas o pacote principal está a ser convertido para SDK. Código
específico de app, automações e integrações devem permanecer fora da API
pública.
