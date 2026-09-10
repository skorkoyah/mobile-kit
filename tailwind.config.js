/** @type {import('tailwindcss').Config} */
const { palette, radius } = require('./constants/tokens.cjs');

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        background: palette.light.background,
        surface: palette.light.surface,
        ink: palette.light.ink,
        ink2: palette.light.ink2,
        muted: palette.light.muted,
        border: palette.light.border,
        accent: palette.light.accent,
        'accent-ink': palette.light.accentInk,
        'accent-soft': palette.light.accentSoft,
        danger: palette.light.danger,
        'danger-soft': palette.light.dangerSoft,
        warn: palette.light.warn,
        'warn-soft': palette.light.warnSoft,
        skeleton: palette.light.skeleton,
        'd-background': palette.dark.background,
        'd-surface': palette.dark.surface,
        'd-ink': palette.dark.ink,
        'd-ink2': palette.dark.ink2,
        'd-muted': palette.dark.muted,
        'd-border': palette.dark.border,
        'd-accent': palette.dark.accent,
        'd-accent-ink': palette.dark.accentInk,
        'd-accent-soft': palette.dark.accentSoft,
        'd-danger': palette.dark.danger,
        'd-danger-soft': palette.dark.dangerSoft,
        'd-warn': palette.dark.warn,
        'd-warn-soft': palette.dark.warnSoft,
        'd-skeleton': palette.dark.skeleton,
      },
      borderRadius: {
        sm: `${radius.sm}px`,
        md: `${radius.md}px`,
        lg: `${radius.lg}px`,
      },
    },
  },
  plugins: [],
};
