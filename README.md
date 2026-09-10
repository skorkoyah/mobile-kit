# Mobile Kit

The starter every day of **100 Apps in 100 Days** begins from. It is an Expo app that already has the boring, important parts done, so a new app is one command and the first prompt goes straight to what is new.

**Pinned:** Expo SDK 57 · React Native 0.86 · TypeScript · Expo Router · NativeWind 4 · Zustand · Reanimated 4 · react-native-keyboard-controller · expo-haptics.

## Run it (once per phase)

A development build is your own private version of this app, installed on your phone, that loads new code from your computer instantly. You build it once per phase; every daily app in the phase runs inside it.

```bash
npm install
eas init                                   # links the project to your Expo account
eas device:create                          # iPhone only: registers your phone
eas build --profile development --platform ios     # or android; 10–20 min in the cloud
npx expo start --dev-client                # then scan the QR code with the phone camera
```

Change a sentence in `app/index.tsx`, save, and watch the phone. That is hot reload.

## Start a new app from the Kit

```bash
npx create-expo-app day-07-flash --template https://github.com/skorkoyah/mobile-kit/tree/v0
```

(or `git clone --branch v0 … && npm install`). Keep the bundle ID and package name as the Kit's shared phase identifier unless this is a submission app; see `KIT-CONTEXT.md` for the block you paste into your AI session.

## What's inside

| Path | What it is |
|------|------------|
| `app/_layout.tsx` | The provider tree every app shares: gestures → keyboard → navigation. |
| `app/index.tsx` | The welcome screen (the hot-reload test). Replace it with your app's first screen. |
| `app/gallery.tsx` | A living style guide: one of every primitive, in both themes. |
| `components/ui/` | The primitives: `Screen`, `T` (text), `Button`, `Row`, `Card`, `Press`, `Skeleton`, `EmptyState`, `ErrorBanner`, `Sheet`. |
| `constants/tokens.ts` | The one place the look is defined (colors, spacing, radius, type, motion). `tokens.cjs` mirrors it for Tailwind; `npm run tokens:check` proves they match. |
| `lib/haptics.ts` | The only file that talks to the haptics library. |
| `lib/storage.ts` | `storage` (plain, AsyncStorage) and `secrets` (keychain, SecureStore). Tokens never go in `storage`. |
| `lib/store.ts` | `createPersistedStore`: a Zustand store that saves to disk and reports when it has loaded. |
| `lib/motion.ts` | The standard enter animation and the reduce-motion hook. |
| `lib/theme.ts` | `useColors()` for the few places `className` can't reach (icon colors, native props). |
| `app.json` | Shared phase identifier, purpose strings, plugins. Submission apps rewrite this. |
| `eas.json` | `development` / `preview` / `production` build profiles. |
| `docs/DECISIONS.md` | Why each choice was made. |

## The polish layer (why apps from this Kit feel finished)

Every screen gets five things for free, and a screen isn't done until it has all five:

1. **Keyboard never covers an input.** `Screen mode="form"` wraps a keyboard-aware scroll view.
2. **Loading shows skeletons, not spinners.** `Skeleton` and `ListSkeleton`.
3. **Empty screens guide the next step.** `EmptyState` with one action.
4. **Every tap responds with spring physics and a light haptic.** `Press`, used by `Button` and `Row`.
5. **Content enters with motion, and respects reduce-motion.** `Card`, `Sheet`, `enter()`.

Plus: dark mode follows the phone, text scales with the user's font-size setting, every control has a screen-reader label.

## Scripts

`npm start` (dev client) · `npm run typecheck` · `npm run tokens:check` · `npm run doctor` · `npm run build:dev`

## Versions

`v0` Phase 0 (this) · later tags add each phase's native layer and the modules built in the phase before. See `docs/DECISIONS.md` for the release ritual.
