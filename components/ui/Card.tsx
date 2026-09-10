import { type ReactNode } from 'react';
import Animated from 'react-native-reanimated';
import { enter } from '@/lib/motion';

type Props = { children: ReactNode; index?: number; className?: string };

/** A surface that enters with fade + slide-up. Pass `index` inside lists so cards cascade in. */
export function Card({ children, index = 0, className = '' }: Props) {
  return (
    <Animated.View
      entering={enter(index)}
      className={`bg-surface dark:bg-d-surface rounded-lg p-4 border border-border dark:border-d-border ${className}`}
    >
      {children}
    </Animated.View>
  );
}
