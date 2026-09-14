import { type ReactNode, useCallback } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { motion } from '@/constants/tokens';
import { haptics } from '@/lib/haptics';
import { useReducedMotion } from '@/lib/motion';

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
 * responds with the same spring physics and the same light haptic.
 *
 * The touchable is a plain React Native Pressable, so `className` sizes the REAL touch target:
 * `<Press className="flex-1">` genuinely makes the whole area tappable. The animation lives on an
 * inner view that carries no className — see the note about Reanimated in docs/DECISIONS.md.
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
    <Pressable
      className={className}
      style={style}
      onPressIn={handleIn}
      onPressOut={handleOut}
      onPress={handlePress}
      {...rest}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}
