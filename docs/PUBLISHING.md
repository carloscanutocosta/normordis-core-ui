# Publicação — GitHub Packages

O pacote é publicado no registry privado do GitHub Packages sob o scope `@carloscanutocosta`.

---

## Pré-requisitos

### Personal Access Token (uma vez por máquina)

1. Ir a [github.com → Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens/new)
2. Criar token com os scopes:
   - `write:packages` — para publicar
   - `read:packages` — para instalar
3. Guardar o token — só é mostrado uma vez

### Variável de ambiente

```powershell
# PowerShell (sessão actual)
$env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxx"

# Para persistir entre sessões (Windows)
[System.Environment]::SetEnvironmentVariable("GITHUB_TOKEN", "ghp_xxxx", "User")
```

```bash
# bash / zsh
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

---

## Publicar uma nova versão

```bash
# 1. Garantir que o build está actualizado
pnpm build

# 2. Bump de versão (escolher semver adequado)
pnpm version patch   # 0.1.0 → 0.1.1  (bug fix)
pnpm version minor   # 0.1.0 → 0.2.0  (nova feature, API compatível)
pnpm version major   # 0.1.0 → 1.0.0  (breaking change)

# 3. Publicar
pnpm publish --no-git-checks
```

O `--no-git-checks` ignora a verificação de working tree limpa. Para CI é recomendado omiti-lo.

---

## Verificar publicação

```bash
# Listar versões publicadas
npm view @carloscanutocosta/core-ui versions --registry https://npm.pkg.github.com
```

---

## Instalar noutros projectos

### 1. Configurar o `.npmrc` do projecto consumidor

Criar (ou adicionar) ao `.npmrc` na raiz do projecto:

```
@carloscanutocosta:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

> Não commitar tokens hardcoded. Usar sempre `${GITHUB_TOKEN}` e definir a variável de ambiente localmente ou via CI secret.

### 2. Instalar o pacote

```bash
pnpm add @carloscanutocosta/core-ui
```

### 3. Importar CSS no entry point

```js
import '@carloscanutocosta/core-ui/dist/normordis-core-ui.css'
```

### 4. Configurar Tailwind para processar as classes do SDK

O SDK não inclui um stylesheet Tailwind pré-processado — as classes são geradas pelo Tailwind do projecto consumidor. É necessário adicionar o caminho dos ficheiros do SDK ao `content` do `tailwind.config.js`:

```js
// tailwind.config.js
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // Permite ao Tailwind detectar as classes usadas pelo SDK
    './node_modules/@carloscanutocosta/core-ui/dist/**/*.js',
  ],
  // ...resto da config
}
```

> Sem esta linha, os componentes do SDK renderizam sem estilos.

### 5. Usar componentes

```jsx
import { TextInput, SelectInput, DateInput } from '@carloscanutocosta/core-ui'

export default function MyForm() {
  return (
    <TextInput
      label="Nome"
      value={name}
      onChange={setName}
      required
    />
  )
}
```

---

## Temas

O CSS publicado inclui as 4 paletas: **light** (default), **dark**, **high-contrast** e **high-contrast-dark**. O tema activo é controlado por classes no elemento `<html>`.

### Opção A — ThemeSwitcher (pronto a usar)

```jsx
import { ThemeSwitcher } from '@carloscanutocosta/core-ui'

// Coloca no header ou onde quiseres
<ThemeSwitcher />
```

Persiste a escolha em `localStorage` automaticamente.

### Opção B — controlo manual

```js
import { applyTheme, getStoredTheme, THEMES } from '@carloscanutocosta/core-ui'

// Restaurar tema guardado no arranque da app
applyTheme(getStoredTheme())

// Mudar tema programaticamente
applyTheme('dark')             // → adiciona classe .dark ao <html>
applyTheme('high-contrast')    // → adiciona .high-contrast
applyTheme('high-contrast-dark')
applyTheme('light')            // → remove todas as classes de tema

// THEMES — lista de { id, label, icon } para construir o teu próprio selector
console.log(THEMES)
// [
//   { id: 'light',            label: 'Light',              icon: 'Sun' },
//   { id: 'dark',             label: 'Dark',               icon: 'Moon' },
//   { id: 'high-contrast',    label: 'High Contrast',      icon: 'Contrast' },
//   { id: 'high-contrast-dark', label: 'High Contrast Dark', icon: 'Monitor' },
// ]
```

---

## CI / GitHub Actions

Para publicar automaticamente num workflow:

```yaml
- name: Publish to GitHub Packages
  run: pnpm publish --no-git-checks
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

O `secrets.GITHUB_TOKEN` é injectado automaticamente pelo GitHub Actions — não precisas de criar um secret manual para publicação no mesmo repositório.

---

## Notas

- O `.npmrc` do repositório usa `${GITHUB_TOKEN}` — é seguro commitar porque não contém tokens hardcoded.
- O aviso `Failed to replace env in config: ${GITHUB_TOKEN}` durante `pnpm build` local é inofensivo quando a variável não está definida; desaparece com o token activo.
- O acesso é `restricted` (privado) — apenas quem tiver o token com `read:packages` consegue instalar.
