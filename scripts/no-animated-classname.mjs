// Guard: some components silently ignore `className` — no error, no warning, the styles just never
// apply. Reanimated views are the ones that bit us (a whole screen's layout and colour vanished),
// but the rule is general: className belongs on core React Native components only.
//
// This scans whole JSX tags, not single lines. The first version matched line by line and missed
// `<Animated.View\n  className="…"\n>` — which is how Prettier and most coding agents format a tag
// with three or more props, so the guard passed while the bug shipped.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

/** Components that drop `className`. Add to this list whenever the Kit pulls in another one. */
const UNSAFE = ['Animated\\.[A-Za-z]+', 'FlashList', 'KeyboardAwareScrollView', 'KeyboardAvoidingView', 'Canvas'];

const bad = [];

function scan(file) {
  const src = readFileSync(file, 'utf8');
  // Collapse every JSX opening tag onto one logical line before matching.
  const flattened = src.replace(/<([A-Za-z][\w.]*)((?:[^<>]|=>)*?)\/?>/gs, (m) => m.replace(/\s+/g, ' '));
  for (const name of UNSAFE) {
    const re = new RegExp(`<(${name})\\b[^<>]*\\bclassName=`, 'g');
    let m;
    while ((m = re.exec(flattened))) {
      const line = src.slice(0, src.indexOf(m[0].slice(0, 40).trim())).split('\n').length;
      bad.push(`${file.replace(root, '')}:~${line}  <${m[1]} … className=…>`);
    }
  }
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(tsx|jsx)$/.test(name)) scan(full);
  }
}

// Everything that isn't node_modules, so a day that invents a new folder is still covered.
walk(root);

if (bad.length) {
  console.error('These components ignore `className` at runtime. Use `style` with tokens instead:\n');
  bad.forEach((b) => console.error('  ' + b));
  console.error('\nSee docs/DECISIONS.md — "className never goes on a Reanimated view".');
  process.exit(1);
}
console.log('no className on components that ignore it');
