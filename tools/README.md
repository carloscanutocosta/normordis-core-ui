# Tools - normordis-core-ui

Esta pasta contem tooling auxiliar do repositório. A entrada operacional para
humanos continua em `scripts/`; os ficheiros em `tools/` devem ser pequenos,
reutilizáveis e chamáveis por scripts, CI ou validações locais.

Os helpers `.sh` são usados pelas entradas principais em `scripts/bash/`; os
helpers `.ps1` continuam disponíveis para os fluxos Windows em
`scripts/powershell/`.

## Areas

- `repo/`: higiene estrutural do repositório e invariantes de SDK.
- `docs/`: verificações simples de documentação obrigatória.
- `package/`: inspeção do pacote gerado por `pnpm pack`.
- `a11y/`: checklist e futuros auxiliares de acessibilidade.

## Principio

Se um comando representa uma operação completa, deve viver em `scripts/`. Se for
um helper especializado que pode ser combinado com outras operações, deve viver
em `tools/`.
