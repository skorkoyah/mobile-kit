/**
 * Motion helpers. Reanimated's layout animations respect the phone's reduce-motion setting on their own
 * (ReduceMotion.System); these helpers make the same promise for hand-built animations.
 */
import { FadeInDown, ReduceMotion, useReducedMotion as useRNReducedMotion } from 'react-native-reanimated';
import { motion } from '@/constants/tokens';

export const useReducedMotion = useRNReducedMotion;

/** The Kit's standard enter animation: fade + slide up, springy. `index` staggers list items (capped so long lists never wait). */
export function enter(index = 0) {
  return FadeInDown.delay(Math.min(index, motion.maxStagger) * motion.stagger)
    .springify()
    .damping(motion.enter.damping)
    .stiffness(motion.enter.stiffness)
    .reduceMotion(ReduceMotion.System);
}
