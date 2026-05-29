import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import configPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['dist/**/*', 'node_modules/**/*', 'storybook-static/**/*', 'coverage/**/*'],
  },
  {
    files: [
      'src/components/**/*.{js,mjs,cjs,jsx}',
      'src/pages/**/*.{js,mjs,cjs,jsx}',
      'src/Layout.jsx',
    ],
    ignores: ['src/lib/**/*', 'src/components/ui/**/*'],
    ...pluginJs.configs.recommended,
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'unused-imports': pluginUnusedImports,
    },
    rules: {
      'no-unused-vars': 'off',
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': ['error', { ignore: ['cmdk-input-wrapper', 'toast-close'] }],
      'react-hooks/rules-of-hooks': 'error',
    },
  },
  // Stories use hooks inside CSF3 `render` functions — this is valid Storybook usage
  // but triggers false-positives from react-hooks/rules-of-hooks.
  // Also provides JSX parser for ui/ stories that are excluded from the main block.
  {
    files: ['src/**/*.stories.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  // Disable ESLint rules that conflict with Prettier — must be last
  configPrettier,
];
