// Checks the colour pairs the Kit actually renders against WCAG AA (4.5:1 for body text).
// This exists because docs/DECISIONS.md once CLAIMED contrast was checked while the primary
// button's white-on-green sat at 4.32:1 — a claim nobody could verify is worse than no claim.
// Runs before every typecheck. Add a pair here whenever a component renders a new combination.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { palette } = require(fileURLToPath(new URL('../constants/tokens.cjs', import.meta.url)));

const channel = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex) => {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [what renders it, foreground token, background token]
const PAIRS = [
  ['Button primary label', 'onAccent', 'accent'],
  ['Button secondary label', 'accentInk', 'accentSoft'],
  ['Button danger label', 'danger', 'dangerSoft'],
  ['Button ghost label', 'ink', 'background'],
  ['body text', 'ink', 'background'],
  ['secondary text', 'ink2', 'background'],
  ['muted text', 'muted', 'background'],
  ['text on a card', 'ink', 'surface'],
  ['muted text on a card', 'muted', 'surface'],
  ['warning text', 'warn', 'warnSoft'],
  ['goal reached label', 'accentInk', 'background'],
];

const MIN = 4.5;
let failed = 0;

for (const theme of ['light', 'dark']) {
  for (const [what, fg, bg] of PAIRS) {
    const r = ratio(palette[theme][fg], palette[theme][bg]);
    if (r < MIN) {
      console.error(`${theme}: ${what} — ${fg} on ${bg} is ${r.toFixed(2)}:1, needs ${MIN}:1`);
      failed++;
    }
  }
}

if (failed) {
  console.error(`\n${failed} colour pair(s) below WCAG AA. Adjust constants/tokens.cjs and re-run.`);
  process.exit(1);
}
console.log(`all ${PAIRS.length * 2} rendered colour pairs pass WCAG AA (${MIN}:1)`);
