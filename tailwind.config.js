/** @type {import('tailwindcss').Config} */
const { palette, radius, spacing } = require('./constants/tokens.cjs');

// Every color is a CSS variable (see global.css, generated from tokens.cjs), so `bg-surface` is
// automatically the right color in light AND dark mode. No `dark:` variants needed anywhere.
const kebab = (s) => s.replace(/([A-Z])/g, '-$1').toLowerCase();
const colors = Object.fromEntries(
  Object.keys(palette.light).map((k) => [kebab(k), `rgb(var(--color-${kebab(k)}) / <alpha-value>)`]),
);
// Spacing is named, not numeric: gap-md, px-lg, py-sm. One scale, defined once in tokens.cjs.
const space = Object.fromEntries(Object.entries(spacing).map(([k, v]) => [k, `${v}px`]));

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    extend: {
      colors,
      spacing: space,
      borderRadius: { sm: `${radius.sm}px`, md: `${radius.md}px`, lg: `${radius.lg}px` },
    },
  },
  plugins: [],
};
