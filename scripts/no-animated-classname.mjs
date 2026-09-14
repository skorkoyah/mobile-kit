// Guard: a Reanimated view silently ignores `className`, so the Kit never uses it on one.
// Styling on an animated element goes through `style` with token values instead.
// Runs before typecheck. See docs/DECISIONS.md.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const bad = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { walk(full); continue; }
    if (!/\.(tsx|jsx)$/.test(name)) continue;
    readFileSync(full, 'utf8').split('\n').forEach((line, i) => {
      if (/<Animated\.[A-Za-z]+[^>]*\bclassName=/.test(line)) {
        bad.push(`${full.replace(root, '')}:${i + 1}  ${line.trim()}`);
      }
    });
  }
}

for (const dir of ['app', 'components', 'lib']) {
  try { walk(join(root, dir)); } catch { /* folder may not exist in a given day */ }
}

if (bad.length) {
  console.error('className on a Reanimated view does nothing at runtime. Use style instead:\n');
  bad.forEach((b) => console.error('  ' + b));
  process.exit(1);
}
console.log('no className on Reanimated views');
