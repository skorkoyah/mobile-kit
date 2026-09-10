import { type ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion, SlideInDown } from 'react-native-reanimated';
import { T } from './Text';
import { motion } from '@/constants/tokens';

type Props = { visible: boolean; onClose: () => void; title?: string; children: ReactNode };

const slide = SlideInDown.springify().damping(motion.snappy.damping).stiffness(motion.snappy.stiffness).reduceMotion(ReduceMotion.System);

/**
 * A bottom sheet that slides up. Tap the dim area, the system back gesture, or the screen-reader
 * escape gesture to close. Safe to put an Input inside: the panel moves above the keyboard.
 */
export function Sheet({ visible, onClose, title, children }: Props) {
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 justify-end">
        <Animated.View entering={FadeIn.duration(150)} className="absolute inset-0 bg-ink/40">
          <Pressable className="flex-1" onPress={onClose} accessibilityLabel="Close" accessibilityRole="button" />
        </Animated.View>
        <Animated.View
          entering={slide}
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
          className="bg-surface rounded-t-lg px-5 pt-3 pb-10"
        >
          <View className="self-center w-10 h-1 rounded-full bg-border mb-3" accessible={false} importantForAccessibility="no" />
          {title ? <T variant="heading" className="mb-3">{title}</T> : null}
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
