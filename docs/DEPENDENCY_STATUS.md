# Estado das dependências

Revisão de 24 de outubro de 2026, a pedido do responsável pelo projeto.

## Atualizações por fases

1. Segurança: DOMPurify 3.4.17, Storybook e addons 10.6.2, Vite 8.3.4,
   Vitest/coverage 5.0.5, Zod 4.6.7, Moment 2.31.0, jsdom 30.1.3 e PostCSS
   8.5.30, com renovação das resoluções transitivas.
2. Patches/minors compatíveis: React/React DOM 19.3.1, formulários, React
   Query, ícones, estilos e ferramentas de desenvolvimento.
3. Primitivas Radix atualizadas em conjunto, mantendo os mínimos públicos.
4. Lexical 0.52.0 com subpacotes explícitos, testes de compatibilidade dos
   editores e correção do nome acessível associado ao rótulo.

A quarentena `minimumReleaseAge: 10080` mantém-se ativa, sem exceções.
O override `brace-expansion@1.1.18: 1.1.21` corrige avisos de DoS na cadeia
de ESLint. Rever a sua remoção quando as dependências ascendentes deixarem
de resolver 1.1.18; confirmar com nova auditoria.

## Riscos residuais e migrações pendentes

- Quill 2.0.3, introduzido por `react-quill-new`, tem um aviso baixo de XSS
  na exportação HTML ([GHSA-v3m3-f69x-jf25](https://github.com/advisories/GHSA-v3m3-f69x-jf25)).
  A auditoria não indica versão corrigida. Não apresentar HTML do editor sem
  sanitização; `RichTextDisplay` aplica DOMPurify. Esta medida não demonstra
  que todas as utilizações do editor estejam protegidas. Uma substituição do
  editor exige verificar conteúdo existente, callback, formatos e acessibilidade.
- ESLint 9 está fora de suporte. A versão atual de `eslint-plugin-react`
  declara suporte até ESLint 9; não forçar ESLint 10 nem omitir conflitos de
  peers. Migrar quando houver suporte compatível e validar a configuração.
- Framer Motion 14 e Size Limit 14 ficam para migrações próprias,
  com revisão das alterações incompatíveis. Não foram necessários para remover
  os avisos críticos, altos e moderados desta auditoria.
- Lexical foi atualizado para 0.52.0 em desenvolvimento. Os checks do projeto
  passaram, mas os testes de montagem dos editores expuseram subpacotes
  importados sem declaração direta: `@lexical/html`, `@lexical/link`,
  `@lexical/list`, `@lexical/rich-text`, `@lexical/selection` e `@lexical/utils`.
  A declaração como peers opcionais e dependências de desenvolvimento foi
  autorizada pelo responsável nesta sessão e aplicada com versões 0.52.0
  alinhadas. A documentação de instalação enumera agora estes subpacotes.
- As notas oficiais de [0.51.0](https://github.com/facebook/lexical/releases/tag/v0.51.0)
  e [0.52.0](https://github.com/facebook/lexical/releases/tag/v0.52.0) assinalam
  distribuição ESM, depreciação de `LexicalComposer` e alterações nas notificações
  de seleção. O SDK já publica ESM; a migração do composer fica para trabalho
  próprio. Não foi ativada exportação JSON compacta.
- Há uma divergência anterior entre `docs/formats/NCRTF.md` (0.1.0) e o
  serializador atual (2.0.0). A atualização de Lexical não altera esse contrato;
  a reconciliação documental exige confirmar a especificação humana aplicável.
- Os peers mantêm o contrato anterior. Em particular, os intervalos de Moment
  e Zod ainda permitem versões assinaladas pela auditoria. Consumidores devem
  usar Moment >=2.31.0 e Zod >=4.6.6 e auditar a sua árvore. Alterar mínimos
  públicos exige preparar a compatibilidade e o versionamento do SDK.
- A cópia de DOMPurify resolvida por jsPDF na aplicação consumidora deve ser
  >=3.4.17; o lockfile e os overrides deste repositório não a controlam.

## Validação

A baseline anterior às alterações passou nos checks do projeto e nos 427
testes. As fases de segurança e patches/minors passaram nos mesmos checks.
A auditoria após a segunda fase indica apenas o aviso baixo de Quill.
Os checks do projeto passaram também após atualizar Radix. A suite final tem
428 testes aprovados, incluindo a regressão de sanitização adicionada.
Formatação, limites de tamanho, build de Storybook e geração do pacote passaram
em Linux. O build de Storybook exigiu execução fora da sandbox porque esta
bloqueava a leitura das interfaces de rede do sistema.
A auditoria final mantém apenas o aviso baixo de Quill (zero críticas, altas
ou moderadas). Mínimos de peers, Windows e revisão visual/a11y manual ainda
precisam de validação antes da publicação.
Testes em jsdom não substituem revisão em browser ou leitor de ecrã.
O SBOM não foi regenerado localmente: Syft não está instalado neste ambiente;
a geração mantém-se no workflow de Trust Baseline.

Após a fase Lexical, os checks e 433 testes com cobertura passaram em Linux,
incluindo cinco testes específicos de compatibilidade. Formatação, build de
Storybook, limites de tamanho e geração do pacote também passaram. A auditoria mantém apenas
o aviso baixo de Quill. A compatibilidade com os mínimos antigos dos peers,
Windows e revisão manual com browser/leitor de ecrã não foram revalidadas.
