import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
        muted: 'var(--color-muted)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
      },
      spacing: {
        // Named spacing tokens — replace values with Figma tokens when ready.
        'layout-xs': 'var(--spacing-xs)',
        'layout-sm': 'var(--spacing-sm)',
        'layout-md': 'var(--spacing-md)',
        'layout-lg': 'var(--spacing-lg)',
        'layout-xl': 'var(--spacing-xl)',
      },
    },
  },
  plugins: [],
} satisfies Config
