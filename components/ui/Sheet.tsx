import { type ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated, { FadeIn, ReduceMotion, SlideInDown } from 'react-native-reanimated';
import { T } from './Text';
import { motion, radius } from '@/constants/tokens';
import { useColors } from '@/lib/theme';

type Props = { visible: boolean; onClose: () => void; title?: string; children: ReactNode };

const slide = SlideInDown.springify().damping(motion.snappy.damping).stiffness(motion.snappy.stiffness).reduceMotion(ReduceMotion.System);

/**
 * A bottom sheet that slides up. Tap the dim area, the system back gesture, or the screen-reader
 * escape gesture to close. Safe to put an Input inside: the panel moves above the keyboard.
 * The contents only exist while open, so the slide-up replays every time.
 * Colours come through `style` on the animated views — a Reanimated view ignores `className`.
 */
export function Sheet({ visible, onClose, title, children }: Props) {
  const colors = useColors();
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {visible ? (
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Animated.View
            entering={FadeIn.duration(150)}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}
          >
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
        </KeyboardAvoidingView>
      ) : null}
    </Modal>
  );
}
