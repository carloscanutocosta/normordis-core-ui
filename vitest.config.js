import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/test/**/*.test.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        'src/components/workspace/**',
        'src/components/forms/**',
        'src/components/data/**',
        'src/components/charts/**',
        'src/components/display/**',
        'src/hooks/**',
        'src/lib/**',
      ],
      exclude: [
        'src/test/**',
        'src/demo/**',
        'src/pages/**',
        'src/showcase/**',
        '**/*.stories.*',
        '**/*.types.*',
      ],
      thresholds: {
        lines: 80,
        functions: 70,
        branches: 75,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
