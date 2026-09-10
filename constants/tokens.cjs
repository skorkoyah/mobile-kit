// CommonJS mirror of tokens.ts for tailwind.config.js (which cannot import TypeScript).
// Keep the values identical to tokens.ts; `npm run tokens:check` verifies they match.
module.exports = {
  palette: {
    light: {
      background: '#F6F7F4', surface: '#FFFFFF', ink: '#1A1E27', ink2: '#4A5262', muted: '#7A8394',
      border: '#D9DDD6', accent: '#1B8A64', accentInk: '#0F5C43', accentSoft: '#DDF1E7',
      danger: '#C23B3B', dangerSoft: '#F9E2E2', warn: '#B8690F', warnSoft: '#FBEBD3', skeleton: '#E4E7E2',
    },
    dark: {
      background: '#151821', surface: '#1D2130', ink: '#ECEEF2', ink2: '#B9BFCB', muted: '#8A92A3',
      border: '#2B3040', accent: '#3FBF8F', accentInk: '#9FE3C7', accentSoft: '#193A2F',
      danger: '#F07070', dangerSoft: '#3D1F1F', warn: '#E0963A', warnSoft: '#3A2A15', skeleton: '#2A2F3F',
    },
  },
  radius: { sm: 8, md: 12, lg: 18, pill: 999 },
};
