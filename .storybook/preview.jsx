import '../src/index.css';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'hsl(0 0% 100%)' },
        { name: 'dark',  value: 'hsl(240 10% 3.9%)' },
      ],
    },
    a11y: {
      // Run axe checks on every story
      element: '#storybook-root',
    },
  },

  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background text-foreground font-sans antialiased p-6">
        <Story />
      </div>
    ),
  ],
};

export default preview;
