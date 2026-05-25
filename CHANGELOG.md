# Changelog

Todas as alterações relevantes deste projeto devem ser documentadas neste ficheiro.

O formato segue a ideia de Keep a Changelog e o versionamento deve seguir SemVer
quando o pacote começar a ser publicado.

## [0.1.0] - 2026-05-24

### Added

- Conversão inicial do projeto para o pacote `@normordis/core-ui`.
- Build em modo biblioteca com Vite.
- Entrada pública do SDK em `src/index.js`.
- Documentação inicial em `README.md` e `docs/MAN.md`.
- Licença EUPL-1.2.
- CI inicial com lint, typecheck e build.
- Fixação inicial de Node.js 24 e pnpm 10.
- Scripts PowerShell para check, build debug/release e backup/restore do
  repositório.
- Pasta `tools/` com validações de higiene do repositório, documentação,
  inspeção de pacote e checklist a11y.
- Baseline de segurança e release com workflows CI/Trust/Release, scripts de
  manifest, política de dependências/provenance e Security Policy.
- Componente inicial `NormordisEditorLexical`, baseado em Lexical, exportado na
  API pública do SDK.
- Toolbar Lexical separada em `NormordisEditorToolbar`, com helpers exportados
  para permitir personalização por apps consumidoras.
- Serializadores iniciais para `.ndt`, `.ndf` e `.ncrft`, mais contratos em
  `docs/formats/` e componente composto `DocumentEditor`.
