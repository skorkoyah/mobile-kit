import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';
import { useColorScheme } from 'react-native';
import { palette, type ColorName } from '@/constants/tokens';

/** The current theme's colors, for the few props `className` can't reach (icon colors, native props). */
export function useColors() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? palette.dark : palette.light;
}

/** Navigation (headers, tabs) painted with the Kit's tokens so they match every screen in both themes. */
export function useNavigationTheme(): Theme {
  const scheme = useColorScheme();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const c = scheme === 'dark' ? palette.dark : palette.light;
  return {
    ...base,
    colors: { ...base.colors, primary: c.accent, background: c.background, card: c.surface, text: c.ink, border: c.border, notification: c.danger },
  };
}

export type { ColorName };
