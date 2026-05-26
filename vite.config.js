import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'node:path'
import dts from 'vite-plugin-dts'

// All peer dependencies must be external so they are not bundled into the dist.
// Consumers install the peers they need; the SDK tree-shakes the rest.
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

export default defineConfig({
  logLevel: 'error',
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/App.jsx', 'src/main.jsx', 'src/demo', 'src/pages', 'src/showcase'],
      rollupTypes: true,
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
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
});
