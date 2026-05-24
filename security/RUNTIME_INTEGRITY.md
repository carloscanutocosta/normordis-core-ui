# Integridade em Runtime

Estado: Draft v0.1.0.

## Objetivo

Documentar o limite de integridade em runtime para este SDK.

## Âmbito

`normordis-core-ui` é uma biblioteca de apresentação React. Não executa controlo
de integridade em runtime por si mesma, não lê filesystem e não valida artefactos
do host consumidor.

## Regras mínimas

- O pacote publicado deve ser verificável antes do consumo por hash, SBOM e
  provenance quando disponível.
- O SDK não deve introduzir dependências runtime obrigatórias de backend,
  filesystem, Tauri, Base44 ou `normordis-kernel`.
- Qualquer futura verificação de integridade deve ser opt-in e compatível com
  ambientes sem `window` ou `document`.

## Evidência esperada

- Manifests e SBOM gerados em CI.
- Pacote `.tgz` incluído em release draft.
- Documentação de exports e CSS público atualizada.

## Relação com NORMORDIS

A integridade neste repositório é principalmente de cadeia de fornecimento. A
integridade runtime pertence às apps consumidoras ou a pacotes próprios.
