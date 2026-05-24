# Acessibilidade

Checklist manual mínima para componentes novos ou alterados:

- Nome acessível claro para controlos interativos.
- Semântica HTML correta antes de ARIA adicional.
- Operação completa por teclado, incluindo overlays, menus e popovers.
- Foco visível em todos os temas.
- Retorno de foco previsível ao fechar overlays.
- Estados `disabled`, `invalid`, `required`, `expanded`, `selected` ou
  equivalentes quando aplicáveis.
- Mensagens de erro associadas ao campo correspondente.
- Contraste WCAG 2.2 AA em claro, escuro e alto contraste.
- Informação importante não transmitida apenas por cor.
- Comportamento aceitável com zoom e texto aumentado.
- Respeito por preferências de movimento reduzido quando houver animações.

Quando forem introduzidos testes de componentes, preferir Testing Library e
`axe-core` ou `jest-axe` para regressões automáticas.
