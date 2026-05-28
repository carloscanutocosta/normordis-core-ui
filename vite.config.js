import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'node:path'
import dts from 'vite-plugin-dts'

// Peer deps externos ao bundle do SDK.
// Aplicado APENAS no build — o dev server serve tudo localmente.
const PEER_EXTERNALS = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  /^@hello-pangea\//,
  /^@hookform\//,
  /^@lexical\//,
  /^@radix-ui\//,
  /^@tanstack\//,
  'canvas-confetti',
  'date-fns',
  /^date-fns\//,
  'framer-motion',
  'html2canvas',
  'jspdf',
  'leaflet',
  'lexical',
  'lodash',
  /^lodash\//,
  'lucide-react',
  'moment',
  'next-themes',
  'react-day-picker',
  'react-hook-form',
  'react-hot-toast',
  'react-leaflet',
  'react-markdown',
  'react-quill',
  'react-resizable-panels',
  'react-router-dom',
  /^react-router-dom\//,
  'recharts',
  'three',
  /^three\//,
  'zod',
];

export default defineConfig(({ command }) => ({
  logLevel: command === 'serve' ? 'info' : 'error',
  plugins: [
    react(),
    ...(command === 'build' ? [dts({
      tsconfigPath: './jsconfig.json',
      include: ['src'],
      exclude: ['src/App.jsx', 'src/main.jsx', 'src/demo', 'src/pages', 'src/showcase'],
      rollupTypes: true,
      insertTypesEntry: true,
    })] : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  ...(command === 'build' ? {
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        formats: ['es'],
        cssFileName: 'normordis-core-ui',
      },
      rollupOptions: {
        external: PEER_EXTERNALS,
        output: {
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js',
        },
      },
    },
  } : {}),
}));
