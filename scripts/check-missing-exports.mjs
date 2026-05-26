import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { resolve, dirname, basename, extname } from 'path';

const root = 'c:/Users/carlo/Documents/Projetos/normordis-core-ui/src';
const EXTS = ['', '.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx', '/index.ts', '/index.tsx'];

// Custom component directories to audit (skip ui/ — covered by explicit export * lines)
const AUDIT_DIRS = ['forms', 'display', 'editor', 'data', 'charts', 'layout', 'ui-extra'];

// Files to ignore (internal helpers, not public components)
const IGNORE_FILES = new Set([
  'index.js', 'index.jsx', 'index.ts', 'index.tsx',
  'FormField.jsx',   // internal layout wrapper — intentionally not exported publicly
]);

function resolveFile(base, specifier) {
  const target = resolve(dirname(base), specifier);
  for (const ext of EXTS) {
    const c = target + ext;
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
}

function getOwnExports(filePath) {
  const src = readFileSync(filePath, 'utf8');
  const names = new Set();
  for (const m of src.matchAll(/export\s*\{([^}]+)\}(?!\s*from)/g)) {
    m[1].split(',').forEach(e => {
      const parts = e.trim().split(/\s+as\s+/);
      const alias = parts[parts.length - 1].trim();
      if (alias && alias !== 'default') names.add(alias);
    });
  }
  for (const m of src.matchAll(/^export\s+(?:(?:async\s+)?function\*?|class|const|let|var)\s+(\w+)/gm)) {
    names.add(m[1]);
  }
  for (const m of src.matchAll(/export\s+\*\s+as\s+(\w+)\s+from/g)) {
    names.add(m[1]);
  }
  // default export name (export default function Foo / export default class Foo)
  for (const m of src.matchAll(/export\s+default\s+(?:function|class)\s+(\w+)/g)) {
    names.add(m[1]);
  }
  return [...names];
}

function collectAllExported(filePath, depth = 0) {
  if (!filePath || !existsSync(filePath) || depth > 6) return new Set();
  const src = readFileSync(filePath, 'utf8');
  const names = new Set();

  for (const m of src.matchAll(/export\s+\*\s+from\s+['"]([^'"]+)['"]/g)) {
    const target = resolveFile(filePath, m[1]);
    if (!target) continue;
    collectAllExported(target, depth + 1).forEach(n => names.add(n));
  }
  for (const m of src.matchAll(/export\s*\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g)) {
    m[1].split(',').forEach(e => {
      const parts = e.trim().split(/\s+as\s+/);
      const alias = parts[parts.length - 1].trim();
      if (alias && alias !== 'default') names.add(alias);
    });
  }
  getOwnExports(filePath).forEach(n => names.add(n));
  return names;
}

// ── Build the set of all exported names from src/index.js ────────────────────
const indexPath = root + '/index.js';
const exported = collectAllExported(indexPath);

// ── Scan each audit dir for component files ──────────────────────────────────
const missing = [];

for (const dir of AUDIT_DIRS) {
  const dirPath = resolve(root, 'components', dir);
  if (!existsSync(dirPath)) continue;

  const files = readdirSync(dirPath).filter(f => {
    if (IGNORE_FILES.has(f)) return false;
    const ext = extname(f);
    return ['.js', '.jsx', '.ts', '.tsx'].includes(ext);
  });

  for (const file of files) {
    const filePath = resolve(dirPath, file);
    const src = readFileSync(filePath, 'utf8');

    // Extract the default export name
    let componentName = null;
    const defMatch =
      src.match(/export\s+default\s+function\s+(\w+)/) ||
      src.match(/export\s+default\s+class\s+(\w+)/);
    if (defMatch) {
      componentName = defMatch[1];
    } else {
      // fallback: filename without extension
      componentName = basename(file, extname(file));
    }

    if (!exported.has(componentName)) {
      missing.push({ dir, file, componentName });
    }
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
if (missing.length === 0) {
  console.log('✅  Todos os componentes estão exportados.');
} else {
  console.log(`⚠️  ${missing.length} componente(s) não exportado(s):\n`);
  let currentDir = null;
  for (const { dir, file, componentName } of missing) {
    if (dir !== currentDir) { console.log(`  [${dir}]`); currentDir = dir; }
    console.log(`    ${file}  →  "${componentName}"`);
  }
}
