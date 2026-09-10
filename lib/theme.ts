import { useColorScheme } from 'react-native';
import { palette, type ColorName } from '@/constants/tokens';

/** Returns the current theme's color set. Use for props that cannot take a className (e.g. icon colors). */
export function useColors() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? palette.dark : palette.light;
}

export type { ColorName };
