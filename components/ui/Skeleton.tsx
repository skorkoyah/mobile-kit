import { useEffect } from 'react';
import { type DimensionValue, View, type ViewStyle } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useReducedMotion } from '@/lib/motion';
import { useColors } from '@/lib/theme';

type Props = { width?: DimensionValue; height?: number; radius?: number; style?: ViewStyle };

/**
 * A grey block shaped like the content that is loading. Pulses 0.4 → 1 → 0.4 on the UI thread.
 * Hidden from screen readers; the container that groups skeletons announces "Loading" once.
 * Colours come through `style` rather than `className`, because this is a Reanimated view.
 */
export function Skeleton({ width = '100%', height = 16, radius = 8, style }: Props) {
  const reduced = useReducedMotion();
  const colors = useColors();
  const opacity = useSharedValue(reduced ? 0.6 : 0.4);

  useEffect(() => {
    if (reduced) {
      opacity.value = 0.6;
      return;
    }
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
    return () => cancelAnimation(opacity);
  }, [opacity, reduced]);

  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[animated, { width, height, borderRadius: radius, backgroundColor: colors.skeleton }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}

/** A ready-made list skeleton: N rows of title + subtitle. Announces "Loading" once. */
export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <View accessibilityLabel="Loading" accessibilityRole="progressbar" accessible>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} className="py-md gap-sm border-b border-border">
          <Skeleton width="60%" height={18} />
          <Skeleton width="40%" height={14} />
        </View>
      ))}
    </View>
  );
}
