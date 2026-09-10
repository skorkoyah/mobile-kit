# Kit decision log

Each entry: what we chose, and why. Newest at the bottom.

- **Expo SDK 57, pinned per Kit version.** Students on one SDK for a whole phase means one build and no drift. The tag is immutable; the next phase gets the next tag.
- **A development build, never Expo Go.** The Kit needs native modules (keyboard controller, Reanimated, Skia, SecureStore) that Expo Go cannot run. One cloud build per phase is the trade.
- **Every native module for the phase is pre-installed in the Kit**, even ones that first appear late in the phase, so no day forces a rebuild.
- **Reanimated for press physics and motion, not a dedicated animation or pressable library.** Reanimated is already required by Expo Router and Gesture Handler, is the de-facto standard with the largest community, and runs on the UI thread. Two fewer niche native modules for beginners to be broken by. `Press` (~40 lines) gives the same spring feel.
- **NativeWind 4 with Tailwind 3.4.** Tailwind 4 is not supported by NativeWind 4; the version is pinned in devDependencies so `npm install` never drifts.
- **Design tokens in `constants/tokens.ts`, mirrored to `tokens.cjs` for Tailwind.** Tailwind's config cannot import TypeScript; `npm run tokens:check` fails the build if the mirror drifts.
- **Dark mode via `dark:` classes that follow the system.** No in-app theme toggle in v0; the phone's setting is the user's choice.
- **`react-dom` pinned to the React version.** npm hoists the newest `react-dom` as an optional peer of Expo, which conflicts with React 19.2.3 and breaks every later `npm install`. Pinning it once fixes the tree.
- **SDK 57 config:** the new architecture is always on (no `newArchEnabled` key), and the splash screen is configured through the `expo-splash-screen` plugin, not a top-level `splash` key. `expo-doctor` enforces the schema.
- **`expo-haptics` behind `lib/haptics.ts`.** Simple, stable, and swappable in one file.
- **Text never disables font scaling.** Dynamic Type is an accessibility promise; `maxFontSizeMultiplier` caps layout damage at 1.6×.
- **`babel-preset-expo` is an explicit devDependency.** npm can nest it under `expo/` instead of hoisting it; a custom `babel.config.js` then fails at bundle time with an Expo Router error about `EXPO_ROUTER_APP_ROOT`. Installing it at the root fixes resolution for good.
- **The welcome screen is the Day 0 hot-reload test** and the gallery is Day 1's tour, so the Kit teaches itself.

## Release ritual (submission days)

1. Merge the phase's JavaScript modules; strip app-specific content into documented stubs.
2. Add the next phase's native layer (modules + purpose strings + background modes + targets).
3. `npm run typecheck && npm run tokens:check && npm run doctor && npx expo export --platform ios`.
4. Bump the version, tag (`v1`, `v2`, …), update the README's "What's inside" and this log.
5. Build the next phase's dev client from the tag and install it.
