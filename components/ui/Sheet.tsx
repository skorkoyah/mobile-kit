import { type ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion, SlideInDown } from 'react-native-reanimated';
import { T } from './Text';
import { motion } from '@/constants/tokens';

type Props = { visible: boolean; onClose: () => void; title?: string; children: ReactNode };

const slide = SlideInDown.springify().damping(motion.snappy.damping).stiffness(motion.snappy.stiffness).reduceMotion(ReduceMotion.System);

/** A bottom sheet that slides up. Tap the dim area, or use the system back gesture, to close. */
export function Sheet({ visible, onClose, title, children }: Props) {
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Animated.View entering={FadeIn.duration(150)} className="flex-1 bg-black/40">
        <Pressable className="flex-1" onPress={onClose} accessibilityLabel="Close" accessibilityRole="button" />
      </Animated.View>
      <Animated.View entering={slide} className="absolute left-0 right-0 bottom-0 bg-surface dark:bg-d-surface rounded-t-[22px] px-5 pt-3 pb-10">
        <View className="self-center w-10 h-1 rounded-full bg-border dark:bg-d-border mb-3" />
        {title ? <T variant="heading" className="mb-3">{title}</T> : null}
        {children}
      </Animated.View>
    </Modal>
  );
}
