/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['Amiri', 'Traditional Arabic', 'Scheherazade New', 'serif'],
      },
      colors: {
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          elevated: 'rgb(var(--color-surface-elevated, var(--color-surface)) / <alpha-value>)',
        },
        text: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        hover: 'rgb(var(--color-hover) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
          light: 'rgb(var(--color-primary-light, 204 251 241) / <alpha-value>)',
        },
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        gold: 'rgb(var(--color-gold) / <alpha-value>)',
      },
      fill: {
        bg: 'rgb(var(--color-bg))',
      },
      boxShadow: {
        'glow': '0 0 20px rgb(var(--color-primary) / 0.15)',
        'glow-lg': '0 0 40px rgb(var(--color-primary) / 0.2)',
        'card': '0 1px 4px rgb(var(--shadow-color) / 0.04), 0 2px 6px rgb(var(--shadow-color) / 0.03)',
        'card-hover': '0 12px 36px -8px rgb(var(--shadow-color) / 0.12), 0 4px 8px -2px rgb(var(--shadow-color) / 0.05)',
        'elevated': '0 4px 16px -2px rgb(var(--shadow-color) / 0.08), 0 2px 6px -1px rgb(var(--shadow-color) / 0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
