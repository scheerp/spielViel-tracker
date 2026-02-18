import type { Config } from 'tailwindcss';
import * as tailwindcssTextshadow from 'tailwindcss-textshadow';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/icons/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        backgroundDark: 'var(--background-dark)',
        backgroundDark2: 'var(--background-dark-2)',
        foreground: 'var(--foreground)',
        foregroundDark: 'var(--foreground-dark)',
        foregroundDark2: 'var(--foreground-dark-2)',
        primary: 'var(--primary)',
        primaryLight: 'var(--primary-light)',
        secondary: 'var(--secondary)',
        tertiary: 'var(--tertiary)',
        quaternary: 'var(--quaternary)',
        quinary: 'var(--quinary)',
        status: 'var(--status)',
        error: 'var(--error)',
      },
      fontFamily: {
        work: ['var(--font-work-sans)', 'sans-serif'],
      },
      boxShadow: {
        darkBottom: '0 3px 0 var(--foreground)',
        darkBottomLg: '0 6px 0 var(--foreground)',
        whiteBottom: '0 3px 0 white',
        whiteBottomLg: '0 6px 0 white',
      },
      textShadow: {
        'outline-dark':
          '1px 1px 1px var(--foreground), 1px -1px 1px var(--foreground), -1px 1px 1px var(--foreground), -1px -1px 1px var(--foreground)',
      },
    },
  },
  plugins: [tailwindcssTextshadow],
} satisfies Config;
