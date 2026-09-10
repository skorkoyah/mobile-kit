/**
 * Teaches NativeWind about the non-core components the Kit styles with `className`:
 * Reanimated's Animated.View, and the keyboard-aware scroll view (including its content container).
 * Imported once from the root layout, before any screen renders.
 */
import { cssInterop } from 'nativewind';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated from 'react-native-reanimated';

cssInterop(Animated.View, { className: 'style' });
cssInterop(KeyboardAwareScrollView, { className: 'style', contentContainerClassName: 'contentContainerStyle' });
