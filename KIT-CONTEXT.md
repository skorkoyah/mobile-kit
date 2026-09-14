# Kit Context (paste this first in every AI coding session)

```
KIT CONTEXT:
- This project started from Samuel's Mobile Kit v0 (Expo SDK 57, pinned). Bundle ID and package name are the Kit's shared phase identifier unless this is a submission app.
- Stack: Expo, React Native, TypeScript, Expo Router (file-based screens), NativeWind (Tailwind classes), Zustand (state), Reanimated (motion), react-native-keyboard-controller, expo-haptics. Later phases add Supabase and RevenueCat.
- Premium feel is mandatory and the Kit provides it: use the Kit's Screen (mode "form" whenever there is a text input), Input, Button, Row, Card, Press, Skeleton, EmptyState, ErrorBanner, Sheet, and T text component. Every data screen shows skeletons while loading, a designed empty state, and an inline recoverable error. Reduced motion is respected automatically.
- The Kit's type scale, spacing scale and palette are shared by every app in the course: never add a size to them for one app's one-off need — keep a one-off in the screen that needs it.
- Tailwind classes only work on core React Native components (View, Text, Pressable, ScrollView, TextInput). An animated view ignores className silently, so style animated elements with the style prop using the Kit's tokens and useColors(). The Kit's own components already do this: className on the Kit's Press sizes the real touch target.
- Colors are Tailwind classes backed by CSS variables (bg-surface, text-ink, border-border, bg-accent…) and are automatically correct in light and dark mode: never write dark: variants and never hardcode a color in a screen. For native props that need a color value, use useColors().
- Storage: plain app data through the Kit's storage helper or createPersistedStore; anything secret through the secrets helper. Never a token in plain storage.
- Testing target is a development build on a physical phone, not Expo Go.
- Never add a native package: the Kit already contains every native module this phase needs, and adding one would force a rebuild. Pure-JavaScript packages may be proposed, listed first, and added only after I confirm.
- After every change, tell me what you changed and why, in plain words.
- Keep every screen's words separate from its styling and its data access, so I can reword, restyle, or swap a service without touching the others.
```
