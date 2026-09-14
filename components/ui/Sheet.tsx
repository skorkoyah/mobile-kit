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
 * Deliberately NOT an animated value. Animating a layout property like margin on the UI thread
 * moves what you see without moving what you can touch: on Android the panel appeared above the
 * keyboard while its buttons were still registered at the bottom of the screen, so taps landed on
 * nothing. Plain state means a normal layout pass, and a normal layout pass always agrees with
 * itself. The panel arrives in place rather than gliding, which costs nothing anyone notices.
 */
function useKeyboardHeight(enabled: boolean) {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setHeight(0);
      return;
    }
    // iOS fires "will" ahead of the keyboard animation, so the panel is already in position as the
    // keyboard arrives. Android only has the "did" events.
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
 * Two things here exist because of Android, and removing either breaks it there while leaving iOS
 * looking fine. The panel carries `elevation` as well as `zIndex`, because Android stacks by
 * elevation and the full-screen backdrop would otherwise sit on top and swallow taps meant for the
 * buttons. And the keyboard gap is plain layout, not an animated style, because an animated layout
 * property moves the pixels without moving the touch target.
 *
 * Colours come through `style` — a Reanimated view ignores `className`. See docs/DECISIONS.md.
 */
export function Sheet({ visible, onClose, title, children }: Props) {
  const colors = useColors();
  const keyboardHeight = useKeyboardHeight(visible);

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
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: radius.lg,
              borderTopRightRadius: radius.lg,
              marginBottom: keyboardHeight,
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
      ) : null}
    </Modal>
  );
}
