// THE source of truth for colors and radius. `npm run tokens:sync` regenerates global.css (CSS variables)
// from this file and verifies constants/tokens.ts mirrors it. Change colors here, then run the sync.
module.exports = {
  palette: {
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
  },
  radius: { sm: 8, md: 12, lg: 18, pill: 999 },
};
