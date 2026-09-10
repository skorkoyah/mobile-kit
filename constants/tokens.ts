/**
 * Design tokens: the ONE place the Kit's look is defined.
 * tailwind.config.js reads these, and components import them for non-className uses.
 * A visual pass changes this file and nothing else.
 */
export const palette = {
  light: {
    background: '#F6F7F4',
    surface: '#FFFFFF',
    ink: '#1A1E27',
    ink2: '#4A5262',
    muted: '#7A8394',
    border: '#D9DDD6',
    accent: '#1B8A64',
    accentInk: '#0F5C43',
    accentSoft: '#DDF1E7',
    danger: '#C23B3B',
    dangerSoft: '#F9E2E2',
    warn: '#B8690F',
    warnSoft: '#FBEBD3',
    skeleton: '#E4E7E2',
  },
  dark: {
    background: '#151821',
    surface: '#1D2130',
    ink: '#ECEEF2',
    ink2: '#B9BFCB',
    muted: '#8A92A3',
    border: '#2B3040',
    accent: '#3FBF8F',
    accentInk: '#9FE3C7',
    accentSoft: '#193A2F',
    danger: '#F07070',
    dangerSoft: '#3D1F1F',
    warn: '#E0963A',
    warnSoft: '#3A2A15',
    skeleton: '#2A2F3F',
  },
} as const;

export type ColorName = keyof typeof palette.light;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

export const radius = { sm: 8, md: 12, lg: 18, pill: 999 } as const;

export const type = {
  display: 34,
  title: 26,
  heading: 20,
  body: 17,
  small: 15,
  caption: 13,
} as const;

/** Spring feel used for enters and presses. */
export const motion = {
  enter: { type: 'spring', damping: 16, stiffness: 160 } as const,
  snappy: { type: 'spring', damping: 20, stiffness: 300 } as const,
  celebrate: { type: 'timing', duration: 320, easing: [0.68, -0.55, 0.265, 1.55] } as const,
  stagger: 60,
  press: { minScale: 0.96, activeOpacity: 0.85, damping: 18, stiffness: 220 },
} as const;
