/**
 * Motion helpers. Reanimated's layout animations already respect the OS reduce-motion setting
 * (ReduceMotion.System is the default); these helpers make the same promise for hand-built animations.
 */
import { FadeInDown, ReduceMotion, useReducedMotion as useRNReducedMotion } from 'react-native-reanimated';
import { motion } from '@/constants/tokens';

export const useReducedMotion = useRNReducedMotion;

/** The Kit's standard enter animation: fade + slide up, springy, staggered by `index` inside lists. */
export function enter(index = 0) {
  return FadeInDown.delay(index * motion.stagger)
    .springify()
    .damping(motion.enter.damping)
    .stiffness(motion.enter.stiffness)
    .reduceMotion(ReduceMotion.System);
}
