import CodeBlock from './CodeBlock';

export default {
  title: 'UI Extra/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  argTypes: {
    language: {
      control: 'select',
      options: ['javascript', 'typescript', 'jsx', 'tsx', 'python', 'css', 'json', 'bash'],
    },
    showLineNumbers: { control: 'boolean' },
    filename: { control: 'text' },
  },
};

const JS_CODE = `import { AppShell } from '@normordis/core-ui/workspace';

export default function App() {
  return (
    <AppShell
      apps={myApps}
      user={{ name: 'João Costa', email: 'joao@empresa.pt' }}
    />
  );
}`;

const JSON_CODE = `{
  "name": "@normordis/core-ui",
  "version": "1.0.0",
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  }
}`;

const BASH_CODE = `pnpm add @normordis/core-ui
pnpm add tailwindcss @tailwindcss/typography`;

export const JavaScript = { args: { code: JS_CODE, language: 'jsx', filename: 'App.jsx' } };
export const JSON = { args: { code: JSON_CODE, language: 'json', filename: 'package.json' } };
export const Bash = { args: { code: BASH_CODE, language: 'bash' } };
export const NoLineNumbers = { args: { code: JS_CODE, language: 'jsx', showLineNumbers: false } };
export const NoFilename = { args: { code: JS_CODE, language: 'javascript' } };
