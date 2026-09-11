/**
 * Design tokens. Colors and radius are mirrored from tokens.cjs (the source Tailwind and the CSS
 * variables are generated from); `npm run tokens:sync` regenerates global.css and fails if this file drifts.
 * Type, spacing, and motion live only here. A visual pass changes tokens.cjs + this file, nothing else.
 */
export const palette = {
  light: {
    background: '#F6F7F4', surface: '#FFFFFF', ink: '#1A1E27', ink2: '#4A5262', muted: '#66707F',
    border: '#D9DDD6', accent: '#1B8A64', accentInk: '#0F5C43', accentSoft: '#DDF1E7', onAccent: '#FFFFFF',
    danger: '#B93535', dangerSoft: '#F9E2E2', warn: '#A65F0C', warnSoft: '#FBEBD3', skeleton: '#E4E7E2',
  },
  dark: {
    background: '#151821', surface: '#1D2130', ink: '#ECEEF2', ink2: '#B9BFCB', muted: '#98A0B0',
    border: '#2B3040', accent: '#3FBF8F', accentInk: '#9FE3C7', accentSoft: '#193A2F', onAccent: '#151821',
    danger: '#F07070', dangerSoft: '#3D1F1F', warn: '#E0963A', warnSoft: '#3A2A15', skeleton: '#2A2F3F',
  },
} as const;

export type ColorName = keyof typeof palette.light;

export const radius = { sm: 8, md: 12, lg: 18, pill: 999 } as const;

/** Spacing scale in points, mirrored from tokens.cjs. In classes these are named: `gap-md`, `px-lg`. */
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

/** Font sizes and line heights, in points. Text scales with the user's font-size setting on top of these. */
export const type = {
  display: { size: 34, line: 40 },
  title: { size: 26, line: 32 },
  heading: { size: 20, line: 26 },
  body: { size: 17, line: 24 },
  small: { size: 15, line: 21 },
  caption: { size: 13, line: 18 },
} as const;

/** Spring feel used for enters and presses, and the stagger between list items. */
export const motion = {
  enter: { damping: 16, stiffness: 160 },
  snappy: { damping: 20, stiffness: 300 },
  stagger: 60,
  maxStagger: 8,
  press: { minScale: 0.96, activeOpacity: 0.85, damping: 18, stiffness: 220 },
} as const;
