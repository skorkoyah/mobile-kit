import { type ReactNode, useEffect, useState } from 'react';
import { Keyboard, Modal, Platform, Pressable, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion, SlideInDown } from 'react-native-reanimated';
import { T } from './Text';
import { motion, radius } from '@/constants/tokens';
import { useColors } from '@/lib/theme';

type Props = { visible: boolean; onClose: () => void; title?: string; children: ReactNode };

const slide = SlideInDown.springify().damping(motion.snappy.damping).stiffness(motion.snappy.stiffness).reduceMotion(ReduceMotion.System);

/**
 * How far the keyboard covers the screen, as ordinary React state — never an animated value.
 * Animating a layout property moves what you see without moving what you can touch.
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
 * **Nothing here overlaps anything.** The dim area and the panel are stacked in a plain column, so
 * the dim area genuinely ends where the panel begins. That is deliberate and it is the whole design:
 * a full-screen backdrop layered behind the panel works on iOS and repeatedly did not on Android,
 * where it kept swallowing taps meant for the buttons. Elevation, zIndex and pointerEvents were all
 * tried against that and none of them settled it. Geometry settles it — there is no stacking left to
 * get wrong, on either platform.
 *
 * The keyboard is a spacer below the panel for the same reason: plain layout, so what you see and
 * what you can touch are the same thing.
 *
 * Colours come through `style` — a Reanimated view ignores `className`. See docs/DECISIONS.md.
 */
export function Sheet({ visible, onClose, title, children }: Props) {
  const colors = useColors();
  const keyboardHeight = useKeyboardHeight(visible);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {visible ? (
        <View style={{ flex: 1 }}>
          <Animated.View entering={FadeIn.duration(150)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
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
            }}
          >
            <View className="px-lg pt-sm pb-xxl">
              <View className="self-center w-10 h-1 rounded-full bg-border mb-md" accessible={false} importantForAccessibility="no" />
              {title ? <T variant="heading" className="mb-md">{title}</T> : null}
              {children}
            </View>
          </Animated.View>

          {keyboardHeight > 0 ? <View style={{ height: keyboardHeight, backgroundColor: colors.surface }} /> : null}
        </View>
      ) : null}
    </Modal>
  );
}
