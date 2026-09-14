import { type ReactNode, useEffect, useState } from 'react';
import { Keyboard, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion, SlideInDown } from 'react-native-reanimated';
import { T } from './Text';
import { motion, radius } from '@/constants/tokens';
import { useColors } from '@/lib/theme';

type Props = { visible: boolean; onClose: () => void; title?: string; children: ReactNode };

const slide = SlideInDown.springify().damping(motion.snappy.damping).stiffness(motion.snappy.stiffness).reduceMotion(ReduceMotion.System);

/**
 * How far the keyboard covers the screen, as ordinary React state.
 *
 * Deliberately not an animated value: animating a layout property on the UI thread moves what you
 * see without moving what you can touch, and on Android that left the panel's buttons registered at
 * the bottom of the screen while the panel drew above the keyboard.
 */
function useKeyboardHeight(enabled: boolean) {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setHeight(0);
      return;
    }
    // iOS fires "will" ahead of the keyboard animation; Android only has the "did" events.
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, (e) => setHeight(e.endCoordinates.height));
    const hide = Keyboard.addListener(hideEvent, () => setHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, [enabled]);

  return height;
}

/**
 * A bottom sheet that slides up. Tap the dim area, the system back gesture, or the screen-reader
 * escape gesture to close. Safe to put an Input inside: the panel sits above the keyboard.
 * The contents only exist while open, so the slide-up replays every time.
 *
 * The shape of this component is the result of Android, and each piece earned its place by breaking
 * without it:
 *  - the panel carries `elevation` as well as `zIndex`. Android stacks by elevation, so the
 *    full-screen backdrop otherwise sits on top and swallows taps meant for the buttons.
 *  - the panel stays wrapped in its own view rather than sitting as a direct sibling of the
 *    backdrop. Flattening that hierarchy is what broke Reset a second time.
 *  - the keyboard gap is padding on the outer container: plain layout, nothing animated, nothing
 *    delegated to a keyboard-avoiding view. A Modal is its own native window, so it never gets
 *    resized and a keyboard-avoiding view cannot help it.
 *
 * Colours come through `style` — a Reanimated view ignores `className`. See docs/DECISIONS.md.
 */
export function Sheet({ visible, onClose, title, children }: Props) {
  const colors = useColors();
  const keyboardHeight = useKeyboardHeight(visible);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {visible ? (
        <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: keyboardHeight }}>
          <Animated.View entering={FadeIn.duration(150)} style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
            <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Close" accessibilityRole="button" />
          </Animated.View>

          <View pointerEvents="box-none">
            <Animated.View
              entering={slide}
              accessibilityViewIsModal
              onAccessibilityEscape={onClose}
              style={{
                backgroundColor: colors.surface,
                borderTopLeftRadius: radius.lg,
                borderTopRightRadius: radius.lg,
                zIndex: 2,
                elevation: 24,
              }}
            >
              <View className="px-lg pt-sm pb-xxl">
                <View className="self-center w-10 h-1 rounded-full bg-border mb-md" accessible={false} importantForAccessibility="no" />
                {title ? <T variant="heading" className="mb-md">{title}</T> : null}
                {children}
              </View>
            </Animated.View>
          </View>
        </View>
      ) : null}
    </Modal>
  );
}
