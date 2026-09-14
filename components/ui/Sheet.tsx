import { type ReactNode, useEffect, useState } from 'react';
import { Keyboard, Modal, Platform, Pressable, View } from 'react-native';
import { T } from './Text';
import { radius } from '@/constants/tokens';
import { useColors } from '@/lib/theme';

type Props = { visible: boolean; onClose: () => void; title?: string; children: ReactNode };

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
 * The contents only exist while open, so the slide replays every time.
 *
 * **There is no Reanimated in here, on purpose.** The slide is the Modal's own native animation.
 * A Reanimated entering animation moves a view with a transform, and on Android a transformed view
 * still receives touches at the position it started from — for a slide-up that is off the bottom of
 * the screen. The panel drew exactly where you saw it and listened somewhere else entirely, so its
 * buttons were dead while everything looked perfect. The native animation moves the window, not the
 * view, so there is nothing to desynchronise.
 *
 * Nothing here overlaps anything either: the dim area and the panel are stacked in a plain column,
 * so there is no z-order to get wrong. Both decisions are in docs/DECISIONS.md.
 *
 * Colours come through `style` — the Kit only puts `className` on core components.
 */
export function Sheet({ visible, onClose, title, children }: Props) {
  const colors = useColors();
  const keyboardHeight = useKeyboardHeight(visible);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
          onPress={onClose}
          accessibilityLabel="Close"
          accessibilityRole="button"
        />

        <View
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
        </View>

        {keyboardHeight > 0 ? <View style={{ height: keyboardHeight, backgroundColor: colors.surface }} /> : null}
      </View>
    </Modal>
  );
}
