# NORMORDIS Core UI: O Padrão de Excelência para a AP e UE

Este documento contém o material necessário para a defesa e apresentação oficial do **NORMORDIS Core UI** a entidades estatais, júris técnicos ou auditorias europeias.

Está dividido em três partes: **Sumário Executivo** (para leitura prévia), **Estrutura de Slides**, e o respetivo **Guião de Apresentação**.

---

## Parte 1: Documento de Apresentação (Sumário Executivo)

**Para:** Administração Pública / Entidades Reguladoras da UE
**Assunto:** Adoção de um Ecossistema de Interface Seguro e Acessível (NORMORDIS Core UI)

### Contexto e Desafio
A Administração Pública (AP) e os organismos da União Europeia enfrentam hoje uma tripla pressão:
1. **Legal:** A obrigatoriedade de cumprir a Diretiva de Acessibilidade Web (WCAG 2.2 AA) sob pena de exclusão de cidadãos e infrações legais.
2. **Cibersegurança:** A iminente entrada em vigor do *Cyber Resilience Act* (CRA), que proíbe software sem rastreabilidade e gestão de vulnerabilidades desde a origem.
3. **Soberania e Fragmentação:** O desperdício de dinheiros públicos na reconstrução contínua de interfaces (silos) que não comunicam visualmente entre si e dependem de licenças proprietárias.

### A Solução: NORMORDIS Core UI
O NORMORDIS Core UI não é apenas uma biblioteca de componentes. É uma infraestrutura de **Soberania Digital**. Trata-se de um SDK React de apresentação que partilha e impõe um *Design System* rigoroso a todo o ecossistema NORMORDIS.

**Os 4 Pilares da Excelência do Projeto:**
1. **Security-by-Design & SLSA:** Cadeia de fornecimento blindada (Geração de SBOM, assinaturas criptográficas de proveniência, análise estática SAST via CodeQL, varrimentos SCA via Grype e bloqueio de credenciais via Gitleaks).
2. **Acessibilidade "Shift-Left":** O cumprimento das regras WCAG 2.2 AA não é uma auditoria final, mas sim uma barreira arquitetónica. Os nossos testes de integração (via `jest-axe`) impedem falhas de acessibilidade de chegarem à produção.
3. **Soberania de Código (EUPL-1.2):** O licenciamento expressamente europeu garante compatibilidade com o Estado sem as contaminações legais de outras licenças abertas.
4. **Escalabilidade Económica:** Desenvolve-se uma vez de forma segura, aplica-se a dezenas de aplicações governamentais, poupando milhões em auditorias individuais de segurança e usabilidade.

---

## Parte 2: Apresentação (Slides)

Podes usar a estrutura abaixo para criar os teus slides no PowerPoint, Keynote ou Google Slides.

````carousel
# 1. NORMORDIS Core UI
### A Fundação Digital Segura e Acessível para a Administração Pública

**Apresentador:** Carlos Costa  
**Contexto:** Ecossistema NORMORDIS  
<!-- slide -->
# 2. O Desafio Atual na AP
*(O que está a falhar no ecossistema de software governamental?)*

- ❌ **Silos de Desenvolvimento**: Cada equipa reinventa a roda visual.
- ❌ **Barreiras de Acessibilidade**: Incumprimento crónico da Diretiva de Acessibilidade Web.
- ❌ **Risco de Cibersegurança**: Falta de rastreabilidade do código (SBOMs inexistentes).
- ❌ **Lock-in Proprietário**: Licenciamento opaco.
<!-- slide -->
# 3. A Solução: NORMORDIS Core UI
*(Muito mais do que componentes bonitos)*

- ✅ **Single Source of Truth**: SDK partilhado (React/Tailwind/Radix).
- ✅ **Acessibilidade Inata**: Testada automaticamente ao milissegundo.
- ✅ **Security-by-Design**: Pipeline certificado de nível militar.
- ✅ **Licenciamento Europeu**: Protegido pela licença EUPL-1.2.
<!-- slide -->
# 4. Acessibilidade Elevada a Lei
*(Diretiva Web & WCAG 2.2 AA)*

> "A acessibilidade não pode ser uma camada de cosmética."

- Utilizamos **Shift-Left Accessibility**.
- Integração de `jest-axe` nos pipelines CI.
- O código só é aceite se o constraste, os leitores de ecrã e a navegação por teclado funcionarem na perfeição.
<!-- slide -->
# 5. Cyber Resilience Act (CRA) & SLSA
*(Preparados para a lei europeia de cibersegurança antes do prazo)*

O nosso pipeline de CI/CD garante **Rastreabilidade Total**:
1. **SAST:** Análise Estática de Código (GitHub CodeQL).
2. **SCA:** Extração de SBOM (Syft) e varrimento de dependências em tempo real (Grype).
3. **Anti-Leak:** Prevenção de fuga de chaves com Gitleaks.
4. **Proveniência:** Assinaturas criptográficas em todos os pacotes.
<!-- slide -->
# 6. Soberania e Impacto Financeiro
*(Porquê escolher este caminho?)*

- **EUPL-1.2**: Proteção total dos interesses europeus e da AP. Sem risco de apropriação indevida ou vírus de licença (AGPL).
- **Time-to-market**: Equipas focam-se nas regras de negócio, o Design e a Segurança UI vêm "de graça".
- **Custo de Auditoria Zero**: A segurança e acessibilidade estão validadas no momento da compilação.
<!-- slide -->
# 7. O Futuro do Ecossistema
*(Próximos Passos)*

- Escalar a adoção do pacote `normordis-core-ui` pelas várias frentes de projeto (ex: *normordis-kernel*, Base44).
- Promover como modelo de *Open Source* para outras áreas do Estado.

**Obrigado.**  
Perguntas?
````

---

## Parte 3: Guião da Apresentação (Pitch Script)

*Usa este guião como base para a tua fala durante os slides.*

**[Slide 1: Título]**
> "Bom dia a todos. Hoje venho apresentar-vos a infraestrutura visual que suportará o ecossistema NORMORDIS: o **NORMORDIS Core UI**. Muito mais do que desenhar ecrãs, vamos falar sobre como garantimos legalidade, acessibilidade e cibersegurança desde a primeira linha de código."

**[Slide 2: O Desafio]**
> "Atualmente, a Administração Pública tem um problema: quando construímos 10 plataformas, construímos 10 botões diferentes, pagamos 10 auditorias de acessibilidade e expomo-nos a 10 vezes mais falhas de segurança nas nossas dependências de interface. Tudo isto gera silos, custos acrescidos e, invariavelmente, software que deixa cidadãos de fora."

**[Slide 3: A Solução]**
> "O NORMORDIS Core UI resolve isso centralizando o problema. É um SDK partilhado. Ao isolarmos a camada visual, as nossas equipas deixam de se preocupar se o componente cumpre o contraste exigido por lei, ou se tem uma vulnerabilidade no gestor de datas. Tudo isto é entregue já mastigado, testado e validado."

**[Slide 4: Acessibilidade Elevada a Lei]**
> "Com a Diretiva de Acessibilidade Web, ser WCAG 2.2 AA já não é opcional, é lei. Neste projeto implementámos aquilo que a indústria chama de 'Shift-Left A11y'. Não esperamos pelo fim do projeto para chamar um auditor cego. A nossa própria infraestrutura (através de suites como o *jest-axe*) testa e chumba imediatamente o trabalho de qualquer engenheiro que envie um código inacessível."

**[Slide 5: Cyber Resilience Act & SLSA]**
> "No que toca a segurança, antecipámo-nos ao *Cyber Resilience Act* da UE. A nossa pipeline de lançamento (CI/CD) foi reconstruída para ser uma fortaleza: extraímos um SBOM (A Fatura de Materiais do Software) de cada atualização, cruzamo-lo com bases de dados globais de CVEs, fazemos análise de injeções via CodeQL e assinamos criptograficamente tudo o que sai das nossas máquinas. Um pacote só é publicado se a máquina garantir que não há uma única falha crítica."

**[Slide 6: Soberania e Impacto Financeiro]**
> "E como o licenciamento é um tema crítico na contratação pública, este pacote usa a licença Europeia EUPL-1.2. Isto protege o Estado. A longo prazo, isto traduz-se em poupança direta: componentes reutilizáveis, com auditoria de segurança intrínseca, permitindo que as equipas foquem todo o orçamento governamental nas regras de negócio da AP, e não a afinar botões."

**[Slide 7: Fecho]**
> "O NORMORDIS Core UI é, portanto, a prova de que a Administração Pública consegue produzir interfaces não apenas bonitas, mas state-of-the-art em termos de compliance e segurança. Estou à disposição para as vossas questões."
