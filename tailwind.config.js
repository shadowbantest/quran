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
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        hover: 'rgb(var(--color-hover) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
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
        'card': '0 1px 3px rgb(var(--shadow-color) / 0.04), 0 1px 2px rgb(var(--shadow-color) / 0.06)',
        'card-hover': '0 10px 30px -5px rgb(var(--shadow-color) / 0.1), 0 4px 6px -2px rgb(var(--shadow-color) / 0.05)',
      },
    },
  },
  plugins: [],
}
