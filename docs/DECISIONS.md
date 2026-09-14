# Kit decision log

Each entry: what we chose, and why. Newest at the bottom.

- **Expo SDK 57, pinned per Kit version.** Students on one SDK for a whole phase means one build and no drift. The tag is immutable; the next phase gets the next tag.
- **A development build, never Expo Go.** Not because Expo Go can't run these libraries (most of them ship in it), but because the course's one-build-per-phase rule needs config plugins (Face ID text, notification icon, media-library strings), a shared identifier, and `expo-dev-client`, none of which Expo Go can carry. One cloud build per phase is the trade.
- **Every native module for the phase is pre-installed in the Kit**, even ones that first appear late in the phase, so no day forces a rebuild. Pure-JavaScript helpers that days will want (icons, navigation theming) are pre-installed too, so no day stalls on "may I add a package?".
- **Reanimated for press physics and motion, not a dedicated animation or pressable library.** Reanimated is the de-facto standard with the largest community, runs animations on the UI thread, and is a peer of Expo Router already. Two fewer niche native modules for beginners to be broken by. `Press` (~50 lines) gives the same spring feel.
- **Colors are CSS variables, generated from one file.** `constants/tokens.cjs` is the source; `npm run tokens:sync` writes `global.css` (light values under `:root`, dark values under `prefers-color-scheme: dark`) and checks `constants/tokens.ts` matches. So `bg-surface` is right in both themes on its own, and nobody has to remember a `dark:` twin. That removes the single most common dark-mode bug before Day 9 teaches dark mode.
- **NativeWind 4 with Tailwind 3.4** (Tailwind 4 is not supported by NativeWind 4). Tailwind and `babel-preset-expo` are explicit devDependencies so `npm install` resolves them at the root; npm otherwise nests the preset under `expo/` and a custom `babel.config.js` fails at bundle time with an Expo Router error about `EXPO_ROUTER_APP_ROOT`.
- **Spacing is named, not numeric.** `gap-md` and `px-lg` come from one scale in `tokens.cjs`, so tightening the whole app's rhythm is one edit. Tailwind's numeric classes still work (the scale is added, not replaced), so an agent writing `px-4` is not broken; the Kit's own components use the names.
- **`tokens:sync` also guards the native colors.** The splash screen, adaptive icon, and notification tint live in `app.json` and cannot read CSS variables, so the script fails if they drift from the palette.
- **The Sheet's contents only exist while it is open.** React Native's `Modal` can keep hidden children mounted, which would make the slide-up animation play once and never again; rendering the contents conditionally guarantees it replays each time.
- **Dark mode follows the phone.** No in-app toggle in v0; the phone's setting is the user's choice. Navigation headers and tabs are themed through `useNavigationTheme()` so they match. Since SDK 56, Expo Router no longer runs on React Navigation and vendors its own `ThemeProvider`; importing `@react-navigation/native` breaks the bundle, so theming types come from `expo-router` itself.
- **`react-dom` pinned to the React version.** npm hoists the newest `react-dom` as an optional peer of Expo, which conflicts with React 19.2.3 and breaks every later `npm install`.
- **SDK 57 config:** the new architecture is always on (no `newArchEnabled` key); the splash screen is configured through the `expo-splash-screen` plugin; Android permissions come from the plugins, never a hand-written list. `expo-doctor` enforces the schema.
- **`className` never goes on a Reanimated view.** `Animated.View` and anything built from
  `createAnimatedComponent` silently ignore it: no error, no warning, the styles just never apply.
  Registering them with NativeWind's `cssInterop` looked like it worked and did not. Found only by
  looking at a real phone, after typecheck, expo-doctor, the bundler and three independent reviews all
  passed on an app whose layout was visibly broken. **The rule: `className` on core React Native
  components only (View, Text, Pressable, ScrollView, TextInput). Animated elements take `style` with
  token values.** `npm run guard` fails the build if a `className` appears on any component that drops it — animated views, lists, keyboard views, Skia canvases — and it scans whole JSX tags, because the first version matched line by line and missed the multi-line formatting that every code formatter produces.
- **The Kit's entrance animation fades and never slides.** Same reason as below, applied
  structurally: `enter()` used to be a fade-and-rise, which meant every `Card` translated — and the
  gallery puts buttons inside cards. Those buttons were one device test away from being dead on
  Android for exactly the reason the sheet's were. Making the shared helper opacity-only removes the
  hazard everywhere at once instead of relying on anyone remembering the rule.
- **Never put a translate-based entering animation on anything containing a control.** On Android a
  view moved by a transform keeps receiving touches at the position it started from. A Reanimated
  `SlideInDown` on the sheet's panel meant it drew at the bottom of the screen and listened from off
  the bottom edge, so its buttons were completely dead while the sheet looked perfect. This is the
  same failure as animating layout, from the opposite direction, and the general rule covers both:
  **if people have to hit it, do not animate its position yourself.** The sheet now slides with the
  Modal's own native animation, which moves the window rather than the view.
- **The sheet's dim area and panel do not overlap.** They are stacked in a plain column, so the dim
  ends exactly where the panel begins. A full-screen backdrop layered behind the panel is the obvious
  way to build this and it worked on iOS while repeatedly failing on Android, where it swallowed taps
  meant for the panel's buttons. Elevation, zIndex and pointerEvents were each tried and none of them
  settled it. Geometry settles it: with no overlap there is no stacking left to get wrong. **When a
  layered layout misbehaves on one platform, prefer removing the overlap over winning the z-order
  argument.**
- **No `statusBarTranslucent` on the sheet's Modal.** On Android it changes the Modal window's
  insets, and after the Modal closes the screen underneath can draw in one coordinate space while
  receiving touches in another. The symptom is a control near the top of the screen that looks
  perfectly normal and simply stops responding, while a control beside it still works.
- **The sheet's keyboard gap is plain layout, never an animated style.** Animating a layout property
  like margin on the UI thread moves what you see without moving what you can touch: on Android the
  panel rendered above the keyboard while its buttons stayed registered at the bottom of the screen,
  so Reset silently did nothing. Ordinary React state means an ordinary layout pass, and a layout pass
  always agrees with itself. Animate transforms and opacity; never animate layout on something people
  have to hit.
- **A keyboard-aware scroll view does not belong inside a Modal.** A Modal is its own native window.
  On Android it never gets resized, so the sheet's panel sat buried under the keyboard with no way to
  see what you were typing; on iOS it re-measured in a loop and the panel visibly bounced before
  settling. The `Sheet` now listens to the keyboard directly and lifts itself, which behaves the same
  on both. The keyboard-aware scroll view stays the right tool for an ordinary screen.
- **Superseded: the `Sheet` once carried `elevation` and `pointerEvents` to win a z-order argument on Android.** None of that is in the code any more and none of it was the real cause — the panel's entering animation was. Kept here only so the trail of wrong fixes is legible: elevation, zIndex, pointerEvents and removing the backdrop overlap were each tried and each failed. See the two rules above for what actually holds.

- **`Press` is a plain `Pressable` on the outside, animated on the inside**, so `className` sizes the real touch target. The first version wrapped an inner animated view, so `<Press className="flex-1">` stretched the *inside* while the actual touchable shrank to fit its content — an app asking for "the whole screen is one giant tap target" silently got a tap target the size of its text. Found when a coding agent, given only the Kit and a prompt, reported it could not make `Press` fill the screen and wrote its own pressable instead. If a primitive is hard to use correctly, that is the primitive's bug.
- **A button owns its buzz.** `Button` takes `haptic="confirm"` (or `select`, `success`, `error`, `impact`, or `false`) and suppresses the automatic tap underneath, so a press is always exactly one buzz. The first version let callers fire a second haptic on top of the automatic one, which turned every "firmer buzz" into two buzzes in a row — found on Day 1.
- **`expo-haptics` behind `lib/haptics.ts`.** Simple, stable, swappable in one file. Every `Press` fires the light tap.
- **Text never disables font scaling.** Dynamic Type is an accessibility promise; `maxFontSizeMultiplier` caps layout damage at 1.6×. Headings announce as headings.
- **Contrast is checked by a script, not by assertion.** `npm run guard` computes the WCAG ratio for every colour pair the Kit actually renders, in both themes, and fails the build below 4.5:1. This replaces an earlier claim that contrast "was checked" — it had not been, and the primary button's white-on-green sat at 4.32:1 for days while the log said otherwise. A claim nobody can verify is worse than no claim. Add a pair to `scripts/contrast-check.mjs` whenever a component renders a new combination.
- **The Kit's EAS project ID is committed in `app.json`.** Every clone re-links with `eas init --force`, the standard flow for any cloned Expo repo; keeping the ID out would force an `app.config.js` that `eas init` cannot edit for students.
- **`createPersistedStore` takes a function that returns only your own fields.** The first version typed it as returning the whole store including `hydrated`, so every app that used it failed to compile until the author added a field the helper is supposed to add itself. Found on Day 1, the first real use. Zustand's `StateCreator<T & Hydrated, [], [], T>` says "`set`/`get` see everything, the function returns `T`", which is what a caller expects.
- **The welcome screen is the Day 0 hot-reload test** and the gallery is Day 1's tour, so the Kit teaches itself.

## Release ritual (submission days)

1. Merge the phase's JavaScript modules; strip app-specific content into documented stubs.
2. Add the next phase's native layer (modules + purpose strings + background modes + targets).
3. `npm run typecheck && npm run doctor && npx expo export --platform ios`.
4. Bump the version, tag (`v1`, `v2`, …), update the README's "What's inside" and this log.
5. Build the next phase's dev client from the tag and install it.
