import { readFileSync, existsSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Derivar o root do repositório a partir da localização deste script.
// scripts/ fica um nível abaixo da raiz do repo, portanto "../src".
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '../src');
const EXTS = ['', '.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx', '/index.ts', '/index.tsx'];

function resolveFile(base, specifier) {
  const target = resolve(dirname(base), specifier);
  for (const ext of EXTS) {
    const candidate = target + ext;
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

// Collect named exports declared directly in a file (no re-exports)
function getOwnExports(filePath) {
  const src = readFileSync(filePath, 'utf8');
  const names = new Set();

  // export { A, B as C }  (without "from", i.e. re-exporting own bindings)
  for (const m of src.matchAll(/export\s*\{([^}]+)\}(?!\s*from)/g)) {
    m[1].split(',').forEach(e => {
      const parts = e.trim().split(/\s+as\s+/);
      const alias = parts[parts.length - 1].trim();
      if (alias && alias !== 'default') names.add(alias);
    });
  }
  // export function/const/class/let/var Foo
  for (const m of src.matchAll(/^export\s+(?:(?:async\s+)?function\*?|class|const|let|var)\s+(\w+)/gm)) {
    names.add(m[1]);
  }
  // export * as Foo from ...
  for (const m of src.matchAll(/export\s+\*\s+as\s+(\w+)\s+from/g)) {
    names.add(m[1]);
  }
  return [...names];
}

// Recursively collect { name, source } for all public named exports of a module.
// `label` is the human-readable path used in reports.
function collectExports(filePath, label, depth = 0) {
  if (!filePath || !existsSync(filePath) || depth > 6) return [];
  const src = readFileSync(filePath, 'utf8');
  const results = [];

  // export * from './foo'
  for (const m of src.matchAll(/export\s+\*\s+from\s+['"]([^'"]+)['"]/g)) {
    const target = resolveFile(filePath, m[1]);
    if (!target) continue;
    collectExports(target, m[1], depth + 1)
      .forEach(e => results.push(e));
  }

  // export { X as Y } from './foo'  (named re-exports, including "default as Y")
  for (const m of src.matchAll(/export\s*\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g)) {
    m[1].split(',').forEach(e => {
      const parts = e.trim().split(/\s+as\s+/);
      const alias = parts[parts.length - 1].trim();
      if (alias && alias !== 'default') results.push({ name: alias, source: label });
    });
  }

  // Own exports (export const Foo, export { Foo } without from, etc.)
  getOwnExports(filePath).forEach(name => results.push({ name, source: label }));

  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const indexPath = root + '/index.ts';
const src = readFileSync(indexPath, 'utf8');
const all = [];

// export * from '...'
for (const m of src.matchAll(/export\s+\*\s+from\s+['"]([^'"]+)['"]/g)) {
  const target = resolveFile(indexPath, m[1]);
  if (!target) { console.log('MISSING:', m[1]); continue; }
  collectExports(target, m[1]).forEach(e => all.push(e));
}

// export { default as X } from '...'  (top-level named re-exports in index.ts)
for (const m of src.matchAll(/export\s*\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g)) {
  m[1].split(',').forEach(e => {
    const parts = e.trim().split(/\s+as\s+/);
    const alias = parts[parts.length - 1].trim();
    if (alias && alias !== 'default') all.push({ name: alias, source: m[2] });
  });
}

// Detect collisions
const byName = {};
all.forEach(({ name, source }) => {
  if (!byName[name]) byName[name] = new Set();
  byName[name].add(source);
});

const collisions = Object.entries(byName)
  .filter(([, srcs]) => srcs.size > 1)
  .sort(([a], [b]) => a.localeCompare(b));

if (collisions.length === 0) {
  console.log(`✅  Sem colisoes de nomes (${all.length} exports verificados).`);
} else {
  console.log(`⚠️  ${collisions.length} colisao(oes) reais encontrada(s):\n`);
  collisions.forEach(([name, sources]) => {
    console.log(`  "${name}" exportado por:`);
    [...sources].forEach(s => console.log(`    - ${s}`));
    console.log('');
  });
  console.log(`Total de exports analisados: ${all.length}`);
}
