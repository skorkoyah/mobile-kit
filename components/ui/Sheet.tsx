import { type ReactNode } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
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
 *
 * Three things here exist because of Android, and removing any of them breaks it there while
 * leaving iOS looking fine:
 *  - the panel carries `elevation` as well as `zIndex`. Android stacks by elevation, so without it
 *    the full-screen backdrop can sit on top and swallow taps meant for the buttons — the sheet
 *    closes and the action never runs.
 *  - the keyboard view is `pointerEvents="box-none"`, so taps pass through its empty area to the
 *    backdrop underneath instead of dying on an invisible full-screen box.
 *  - `behavior="padding"` is iOS-only. Android resizes the window itself, and forcing padding there
 *    shifts the panel.
 *
 * Colours come through `style` — a Reanimated view ignores `className`. See docs/DECISIONS.md.
 */
export function Sheet({ visible, onClose, title, children }: Props) {
  const colors = useColors();
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {visible ? (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Animated.View entering={FadeIn.duration(150)} style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
            <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Close" accessibilityRole="button" />
          </Animated.View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            pointerEvents="box-none"
          >
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
          </KeyboardAvoidingView>
        </View>
      ) : null}
    </Modal>
  );
}
