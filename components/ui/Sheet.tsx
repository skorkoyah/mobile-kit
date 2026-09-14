import { type ReactNode, useEffect } from 'react';
import { Keyboard, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion, SlideInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { T } from './Text';
import { motion, radius } from '@/constants/tokens';
import { useReducedMotion } from '@/lib/motion';
import { useColors } from '@/lib/theme';

type Props = { visible: boolean; onClose: () => void; title?: string; children: ReactNode };

const slide = SlideInDown.springify().damping(motion.snappy.damping).stiffness(motion.snappy.stiffness).reduceMotion(ReduceMotion.System);

/**
 * Lifts whatever it styles above the keyboard, measured from the keyboard itself.
 *
 * The Kit's keyboard-aware scroll view is the right tool on a normal screen, but NOT inside a
 * Modal: a Modal is its own native window, so on Android it never gets resized and the panel stays
 * buried under the keyboard, and on iOS it re-measures in a loop and the panel visibly jitters.
 * Listening to the keyboard directly works the same in both places.
 */
function useKeyboardLift(enabled: boolean) {
  const lift = useSharedValue(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!enabled) {
      lift.value = 0;
      return;
    }
    // iOS fires "will" events ahead of the animation, so the panel moves with the keyboard rather
    // than after it. Android only has the "did" events.
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const to = (height: number, duration: number) => {
      lift.value = reduced ? height : withTiming(height, { duration });
    };
    const show = Keyboard.addListener(showEvent, (e) => to(e.endCoordinates.height, e.duration || 250));
    const hide = Keyboard.addListener(hideEvent, (e) => to(0, e.duration || 250));
    return () => {
      show.remove();
      hide.remove();
    };
  }, [enabled, lift, reduced]);

  return useAnimatedStyle(() => ({ marginBottom: lift.value }));
}

/**
 * A bottom sheet that slides up. Tap the dim area, the system back gesture, or the screen-reader
 * escape gesture to close. Safe to put an Input inside: the panel rides above the keyboard.
 * The contents only exist while open, so the slide-up replays every time.
 *
 * Two things here exist because of Android, and removing either breaks it there while leaving iOS
 * looking fine: the panel carries `elevation` as well as `zIndex`, because Android stacks by
 * elevation and the full-screen backdrop would otherwise sit on top and swallow taps meant for the
 * buttons; and the keyboard lift is measured rather than delegated, because a Modal is its own
 * window and never gets resized.
 *
 * Colours come through `style` — a Reanimated view ignores `className`. See docs/DECISIONS.md.
 */
export function Sheet({ visible, onClose, title, children }: Props) {
  const colors = useColors();
  const liftStyle = useKeyboardLift(visible);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {visible ? (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Animated.View entering={FadeIn.duration(150)} style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
            <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Close" accessibilityRole="button" />
          </Animated.View>

          <Animated.View
            entering={slide}
            accessibilityViewIsModal
            onAccessibilityEscape={onClose}
            style={[
              {
                backgroundColor: colors.surface,
                borderTopLeftRadius: radius.lg,
                borderTopRightRadius: radius.lg,
                zIndex: 2,
                elevation: 24,
              },
              liftStyle,
            ]}
          >
            <View className="px-lg pt-sm pb-xxl">
              <View className="self-center w-10 h-1 rounded-full bg-border mb-md" accessible={false} importantForAccessibility="no" />
              {title ? <T variant="heading" className="mb-md">{title}</T> : null}
              {children}
            </View>
          </Animated.View>
        </View>
      ) : null}
    </Modal>
  );
}
