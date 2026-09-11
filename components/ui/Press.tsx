import { type ReactNode, useCallback } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { motion } from '@/constants/tokens';
import { haptics } from '@/lib/haptics';
import { useReducedMotion } from '@/lib/motion';

/**
 * The touchable itself is the animated element, so `className` sets BOTH the layout of the real
 * touch target and the thing that springs. `<Press className="flex-1">` really does make the whole
 * area tappable — an earlier version put the class on an inner view, so the touch target quietly
 * shrank to fit its content.
 */
export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
 * responds with the same spring physics and the same light haptic. The animation runs on the UI
 * thread (Reanimated), so it stays smooth even while JavaScript is busy. Under reduce-motion the
 * press still gives feedback, without the spring.
 */
export function Press({ children, feedback = 'scale', haptic = true, onPressIn, onPressOut, onPress, style, className, ...rest }: Props) {
  const pressed = useSharedValue(0);
  const reduced = useReducedMotion();

  const animatedStyle = useAnimatedStyle(() => {
    if (feedback === 'opacity') return { opacity: 1 - pressed.value * (1 - motion.press.activeOpacity) };
    return { transform: [{ scale: 1 - pressed.value * (1 - motion.press.minScale) }] };
  });

  const setPressed = useCallback(
    (to: number) => {
      pressed.value = reduced ? to : withSpring(to, spring);
    },
    [pressed, reduced],
  );

  const handleIn = useCallback<NonNullable<PressableProps['onPressIn']>>((e) => { setPressed(1); onPressIn?.(e); }, [onPressIn, setPressed]);
  const handleOut = useCallback<NonNullable<PressableProps['onPressOut']>>((e) => { setPressed(0); onPressOut?.(e); }, [onPressOut, setPressed]);
  const handlePress = useCallback<NonNullable<PressableProps['onPress']>>((e) => { if (haptic) haptics.tap(); onPress?.(e); }, [haptic, onPress]);

  return (
    <AnimatedPressable
      onPressIn={handleIn}
      onPressOut={handleOut}
      onPress={handlePress}
      style={[animatedStyle, style]}
      className={className}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
