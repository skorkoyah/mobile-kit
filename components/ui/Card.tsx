import { type ReactNode } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { enter } from '@/lib/motion';

type Props = { children: ReactNode; index?: number; className?: string };

/**
 * A surface that enters with fade + slide-up. Pass `index` inside lists so cards cascade in.
 * The animation sits on the outer view and the styling on the inner one, because a Reanimated
 * view does not accept `className` — see docs/DECISIONS.md.
 */
export function Card({ children, index = 0, className = '' }: Props) {
  return (
    <Animated.View entering={enter(index)}>
      <View className={`bg-surface rounded-lg p-md border border-border ${className}`}>{children}</View>
    </Animated.View>
  );
}
