/**
 * Lets Reanimated's Animated.View accept `className`, so the Kit's animated primitives
 * use the same Tailwind tokens as everything else. Imported once from the root layout.
 */
import { cssInterop } from 'nativewind';
import Animated from 'react-native-reanimated';

cssInterop(Animated.View, { className: 'style' });
