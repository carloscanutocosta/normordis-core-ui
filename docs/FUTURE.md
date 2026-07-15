# FUTURE - Posicionamento e abertura

Este documento regista a direção estratégica do
`@carloscanutocosta/core-ui` como biblioteca open source de UI/UX, mantendo a
identidade NORMORDIS e o contrato técnico do SDK.

Não substitui `README.md`, `docs/MAN.md`, `DESIGN.md` nem `CHANGELOG.md`.
Serve como documento de rumo: posicionamento, maturidade esperada, lacunas a
resolver e critérios para manter uma abertura pública responsável.

## Tese

O projeto tem potencial open source, caso essa intenção avance para decisão, se
for apresentado com uma opinião clara:

> Uma biblioteca React de componentes, tokens e padrões UX sóbrios, acessíveis
> por defeito, pensados para aplicações administrativas, institucionais, dados,
> formulários e workflows complexos.

O valor distintivo não deve ser competir como mais uma biblioteca visual
generalista. O espaço mais forte é software operacional: interfaces densas,
previsíveis, legíveis, acessíveis e preparadas para uso prolongado por equipas
que trabalham com processos, documentos, registos, métricas e decisão.

## Posicionamento

`normordis-core-ui` deve ser entendido como um SDK de UX institucional e
operacional.

É adequado para:

- aplicações internas e administrativas;
- portais institucionais autenticados;
- backoffices;
- sistemas de gestão documental;
- workflows de aprovação, revisão, triagem e arquivo;
- formulários longos e dados estruturados;
- tabelas, listas, estados e painéis de trabalho;
- produtos que precisam de acessibilidade real como requisito base.

Não deve tentar ser:

- uma biblioteca promocional para landing pages;
- um tema visual decorativo;
- uma coleção de componentes sem contrato de integração;
- uma app completa;
- uma camada de regras de negócio;
- uma abstração sobre backend, autenticação ou persistência.

## Proposta de valor

A proposta pública deve assentar em cinco ideias:

1. **Acessibilidade por defeito**
   WCAG, foco visível, semântica correta, teclado, contraste e estados
   programáticos fazem parte do contrato funcional.

2. **Densidade calma**
   A biblioteca deve favorecer interfaces compactas, estruturadas e legíveis,
   sem desperdiçar espaço nem cair em ruído visual.

3. **Padrões para trabalho real**
   Formulários, dados, layout, feedback, estados vazios, erros e workflows
   devem ser tratados como experiências completas, não apenas como componentes
   isolados.

4. **Contrato limpo de SDK**
   O pacote deve exportar apenas apresentação reutilizável, sem dependências de
   app concreta, routing, auth, filesystem, Tauri ou backend.

5. **Temas institucionais**
   Temas claro, escuro e alto contraste devem ser parte do produto, com tokens
   documentados e composição previsível.

## Audiência

Uma eventual abertura deve falar com equipas que constroem aplicações React
sérias e duráveis:

- developers frontend em produtos internos ou SaaS operacional;
- equipas públicas, municipais, jurídicas, educativas, clínicas ou
  administrativas;
- equipas pequenas que precisam de uma base UI consistente sem desenhar tudo de
  raiz;
- organizações que valorizam acessibilidade e previsibilidade acima de
  tendências visuais.

## Critérios de prontidão open source

Antes de qualquer abertura pública ampla, o repositório deve cumprir estes
critérios:

- `README.md` deve explicar claramente o posicionamento, instalação, peer
  dependencies, CSS, temas e exemplos essenciais.
- `docs/MAN.md` deve continuar a definir contrato público, invariantes,
  limites, qualidade e integração.
- `DESIGN.md` deve continuar alinhado com a linguagem visual operacional e a
  baseline de acessibilidade.
- A API pública em `src/index.js` deve estar revista e livre de componentes
  acoplados a uma app concreta.
- O CSS publicado deve ter caminho estável e documentado.
- `react` e `react-dom` devem permanecer como `peerDependencies`.
- A licença, política de segurança, contribuição e modelo de governação devem
  estar explícitos.
- Deve existir uma forma simples de ver e testar componentes, idealmente
  Storybook ou showcase equivalente separado do SDK.
- Deve haver exemplos mínimos de teclado, foco, erro, disabled, required,
  invalid, selected, expanded e alto contraste nos componentes principais.
- Deve haver checks reproduzíveis para lint, typecheck, build e inspeção do
  pacote.

## Lacunas a fechar

Prioridade alta:

- separar showcase herdado para `demo/` ou `examples/`;
- rever exports públicos para remover qualquer superfície demasiado específica;
- documentar uma matriz de componentes com estado de maturidade e garantias de
  acessibilidade;
- adicionar testes comportamentais aos componentes mais usados;
- garantir declaração TypeScript para consumidores;
- definir `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md` e política de releases.

Prioridade média:

- criar documentação visual navegável;
- adicionar exemplos de integração com Tailwind em apps consumidoras;
- publicar guidelines de theming e extensão de tokens;
- criar exemplos de padrões completos: formulário com erros, tabela filtrável,
  layout com navegação e dialog acessível;
- documentar dependências opcionais por família de componentes;
- automatizar versionamento com Changesets ou processo equivalente.

Prioridade baixa:

- criar templates de app consumidora;
- preparar site público de documentação;
- publicar comparações honestas com alternativas conhecidas;
- recolher feedback de primeiras equipas externas.

## Narrativa pública inicial

Uma descrição curta possível:

> `@carloscanutocosta/core-ui` é uma biblioteca React de componentes e padrões UX para
> aplicações institucionais e operacionais. Foi desenhada para interfaces
> densas, acessíveis e previsíveis: formulários, dados, documentos, workflows e
> trabalho prolongado.

Uma descrição mais técnica:

> SDK React baseado em Radix UI, Tailwind CSS e tokens próprios, com componentes
> reutilizáveis para formulários, dados, layout, display, charts e edição rich
> text. O pacote publica uma camada de apresentação partilhada, sem backend,
> autenticação concreta, persistência ou regras de negócio de app.

## Riscos

- Abrir demasiado cedo pode expor componentes ainda acoplados ao historial da
  app de origem.
- Uma promessa ampla sem documentação visual pode reduzir confiança inicial.
- A quantidade de componentes pode parecer impressionante mas difícil de
  avaliar se não houver exemplos e estado de maturidade por família.
- A licença EUPL-1.2 deve ser explicada a consumidores que estejam mais
  habituados a MIT ou Apache-2.0.
- A acessibilidade só deve ser usada como diferencial se for verificável em
  documentação, exemplos e testes.

## Caminho recomendado

Com a abertura pública decidida, o caminho recomendado é evoluir o projeto em
fases que preservem a qualidade do contrato:

1. **Higiene interna**
   Rever exports, separar demo, fechar acoplamentos e alinhar documentação.

2. **Documentação de consumo**
   Melhorar quickstart, temas, peer dependencies, padrões e exemplos
   acessíveis.

3. **Prova visual**
   Criar Storybook ou showcase público, com estados e temas por componente.

4. **Confiança de pacote**
   Adicionar testes, declarações TypeScript, release notes e processo de
   versionamento.

5. **Abertura sustentável**
   Recolher feedback, estabilizar a API e explicitar a compatibilidade antes
   de prometer suporte de longo prazo.

O objetivo não deve ser parecer maior do que é. Deve ser claro, fiável e
coerente: uma base UI/UX sóbria, acessível e pronta para software operacional.
