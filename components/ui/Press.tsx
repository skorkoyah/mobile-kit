import { type ReactNode, useCallback } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { motion } from '@/constants/tokens';
import { haptics } from '@/lib/haptics';

type Props = Omit<PressableProps, 'style' | 'children'> & {
  children: ReactNode;
  /** 'scale' shrinks slightly (buttons, cards, rows); 'opacity' dims (icon and secondary actions). */
  feedback?: 'scale' | 'opacity';
  /** Fire the light tap haptic on press. On by default; turn off for passive UI. */
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
};

const spring = { damping: motion.press.damping, stiffness: motion.press.stiffness };

/**
 * The one pressable in the Kit. Every button, row, and card uses it, so every tap in every app
 * responds with the same spring physics and the same light haptic. Built on Reanimated: the
 * animation runs on the UI thread, so it stays smooth even while JavaScript is busy.
 */
export function Press({ children, feedback = 'scale', haptic = true, onPressIn, onPressOut, onPress, style, className, ...rest }: Props) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    if (feedback === 'opacity') {
      return { opacity: 1 - pressed.value * (1 - motion.press.activeOpacity) };
    }
    return { transform: [{ scale: 1 - pressed.value * (1 - motion.press.minScale) }] };
  });

  const handleIn: PressableProps['onPressIn'] = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPressIn']>>[0]) => {
      pressed.value = withSpring(1, spring);
      onPressIn?.(e);
    },
    [onPressIn, pressed],
  );
  const handleOut: PressableProps['onPressOut'] = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPressOut']>>[0]) => {
      pressed.value = withSpring(0, spring);
      onPressOut?.(e);
    },
    [onPressOut, pressed],
  );
  const handlePress: PressableProps['onPress'] = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
      if (haptic) haptics.tap();
      onPress?.(e);
    },
    [haptic, onPress],
  );

  return (
    <Pressable onPressIn={handleIn} onPressOut={handleOut} onPress={handlePress} {...rest}>
      <Animated.View style={[animatedStyle, style]} className={className}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
