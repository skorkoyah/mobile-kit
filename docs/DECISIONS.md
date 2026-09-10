# Kit decision log

Each entry: what we chose, and why. Newest at the bottom.

- **Expo SDK 57, pinned per Kit version.** Students on one SDK for a whole phase means one build and no drift. The tag is immutable; the next phase gets the next tag.
- **A development build, never Expo Go.** Not because Expo Go can't run these libraries (most of them ship in it), but because the course's one-build-per-phase rule needs config plugins (Face ID text, notification icon, media-library strings), a shared identifier, and `expo-dev-client`, none of which Expo Go can carry. One cloud build per phase is the trade.
- **Every native module for the phase is pre-installed in the Kit**, even ones that first appear late in the phase, so no day forces a rebuild. Pure-JavaScript helpers that days will want (icons, navigation theming) are pre-installed too, so no day stalls on "may I add a package?".
- **Reanimated for press physics and motion, not a dedicated animation or pressable library.** Reanimated is the de-facto standard with the largest community, runs animations on the UI thread, and is a peer of Expo Router already. Two fewer niche native modules for beginners to be broken by. `Press` (~50 lines) gives the same spring feel.
- **Colors are CSS variables, generated from one file.** `constants/tokens.cjs` is the source; `npm run tokens:sync` writes `global.css` (light values under `:root`, dark values under `prefers-color-scheme: dark`) and checks `constants/tokens.ts` matches. So `bg-surface` is right in both themes on its own, and nobody has to remember a `dark:` twin. That removes the single most common dark-mode bug before Day 9 teaches dark mode.
- **NativeWind 4 with Tailwind 3.4** (Tailwind 4 is not supported by NativeWind 4). Tailwind and `babel-preset-expo` are explicit devDependencies so `npm install` resolves them at the root; npm otherwise nests the preset under `expo/` and a custom `babel.config.js` fails at bundle time with an Expo Router error about `EXPO_ROUTER_APP_ROOT`.
- **NativeWind is taught about the two non-core components the Kit styles** (`Animated.View`, `KeyboardAwareScrollView` with its content container) in `lib/nativewind.ts`. Without that, `className` on them typechecks and silently does nothing.
- **Dark mode follows the phone.** No in-app toggle in v0; the phone's setting is the user's choice. Navigation headers and tabs are themed through `useNavigationTheme()` so they match. Since SDK 56, Expo Router no longer runs on React Navigation and vendors its own `ThemeProvider`; importing `@react-navigation/native` breaks the bundle, so theming types come from `expo-router` itself.
- **`react-dom` pinned to the React version.** npm hoists the newest `react-dom` as an optional peer of Expo, which conflicts with React 19.2.3 and breaks every later `npm install`.
- **SDK 57 config:** the new architecture is always on (no `newArchEnabled` key); the splash screen is configured through the `expo-splash-screen` plugin; Android permissions come from the plugins, never a hand-written list. `expo-doctor` enforces the schema.
- **`expo-haptics` behind `lib/haptics.ts`.** Simple, stable, swappable in one file. Every `Press` fires the light tap.
- **Text never disables font scaling.** Dynamic Type is an accessibility promise; `maxFontSizeMultiplier` caps layout damage at 1.6×. Headings announce as headings.
- **Contrast is checked at token time.** Light `muted` and the on-accent text color were chosen to pass 4.5:1 on their backgrounds in both themes (dark ink on the dark-mode accent, not white).
- **The Kit's EAS project ID is committed in `app.json`.** Every clone re-links with `eas init --force`, the standard flow for any cloned Expo repo; keeping the ID out would force an `app.config.js` that `eas init` cannot edit for students.
- **The welcome screen is the Day 0 hot-reload test** and the gallery is Day 1's tour, so the Kit teaches itself.

## Release ritual (submission days)

1. Merge the phase's JavaScript modules; strip app-specific content into documented stubs.
2. Add the next phase's native layer (modules + purpose strings + background modes + targets).
3. `npm run typecheck && npm run doctor && npx expo export --platform ios`.
4. Bump the version, tag (`v1`, `v2`, …), update the README's "What's inside" and this log.
5. Build the next phase's dev client from the tag and install it.
