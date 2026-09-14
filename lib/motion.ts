/**
 * Motion helpers. Reanimated's layout animations respect the phone's reduce-motion setting on their
 * own (ReduceMotion.System); these helpers make the same promise for hand-built animations.
 */
import { FadeIn, ReduceMotion, useReducedMotion as useRNReducedMotion } from 'react-native-reanimated';
import { motion } from '@/constants/tokens';

export const useReducedMotion = useRNReducedMotion;

/**
 * The Kit's standard enter animation: a fade. `index` staggers list items (capped so long lists
 * never wait).
 *
 * It fades and does NOT slide, and that is a hard rule rather than a taste. An entering animation
 * that moves a view does it with a transform, and on Android a transformed view keeps receiving
 * touches at the position it started from. Anything tappable inside it is then dead while looking
 * perfectly normal — which is exactly how the sheet's buttons behaved. Opacity has no such effect,
 * so a fade is safe anywhere, including around controls.
 *
 * If a screen genuinely needs something to travel across the screen, animate a view that contains
 * nothing anyone has to hit.
 */
export function enter(index = 0) {
  return FadeIn.delay(Math.min(index, motion.maxStagger) * motion.stagger)
    .duration(220)
    .reduceMotion(ReduceMotion.System);
}
