// Verifies constants/tokens.cjs matches constants/tokens.ts (palette + radius). Run: npm run tokens:check
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const cjs = require(fileURLToPath(new URL('../constants/tokens.cjs', import.meta.url)));
const ts = readFileSync(fileURLToPath(new URL('../constants/tokens.ts', import.meta.url)), 'utf8');
let bad = 0;
for (const theme of ['light', 'dark']) {
  const start = ts.indexOf(`${theme}: {`);
  const block = ts.slice(start, ts.indexOf('},', start));
  for (const [k, v] of Object.entries(cjs.palette[theme])) {
    if (!new RegExp(`${k}:\\s*'${v}'`).test(block)) { console.error(`tokens mismatch: ${theme}.${k}`); bad++; }
  }
}
for (const [k, v] of Object.entries(cjs.radius)) {
  if (!new RegExp(`${k}:\\s*${v}\\b`).test(ts)) { console.error(`radius mismatch: ${k}`); bad++; }
}
if (bad) process.exit(1);
console.log('tokens.cjs matches tokens.ts');
