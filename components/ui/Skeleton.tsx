import { useEffect } from 'react';
import { type DimensionValue, View } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useReducedMotion } from '@/lib/motion';

type Props = { width?: DimensionValue; height?: number; radius?: number; className?: string };

/**
 * A grey block shaped like the content that is loading. Pulses 0.4 → 1 → 0.4 on the UI thread.
 * Compose screen-specific skeletons from several of these; never show a bare spinner.
 */
export function Skeleton({ width = '100%', height = 16, radius = 8, className = '' }: Props) {
  const reduced = useReducedMotion();
  const opacity = useSharedValue(reduced ? 0.6 : 0.4);

  useEffect(() => {
    if (reduced) {
      opacity.value = 0.6;
      return;
    }
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
    return () => cancelAnimation(opacity);
  }, [opacity, reduced]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[style, { width, height, borderRadius: radius }]}
      className={`bg-skeleton dark:bg-d-skeleton ${className}`}
      accessibilityLabel="Loading"
    />
  );
}

/** A ready-made list skeleton: N rows of title + subtitle. */
export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} className="py-3 gap-2 border-b border-border dark:border-d-border">
          <Skeleton width="60%" height={18} />
          <Skeleton width="40%" height={14} />
        </View>
      ))}
    </>
  );
}
