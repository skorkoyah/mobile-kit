import { ActivityIndicator, View } from 'react-native';
import { Press } from './Press';
import { T } from './Text';
import { haptics } from '@/lib/haptics';
import { useColors } from '@/lib/theme';

/** Which buzz this button means. `false` for none. Defaults to the light tap every press gets. */
type HapticName = keyof typeof haptics;

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  /** 'tap' (default) · 'select' · 'confirm' · 'success' · 'error' · 'impact' · false for silent. */
  haptic?: HapticName | false;
  /** What a screen reader says, when the visible label carries a symbol that wouldn't read well. */
  accessibilityLabel?: string;
  accessibilityHint?: string;
  className?: string;
};

const shells = {
  primary: 'bg-accent',
  secondary: 'bg-accent-soft',
  ghost: 'bg-transparent border border-border',
  danger: 'bg-danger-soft',
};
const labels = { primary: 'onAccent', secondary: 'accent', ghost: 'ink', danger: 'danger' } as const;

/**
 * Every button in the Kit: spring press, screen-reader role, 52pt minimum touch target, and
 * exactly ONE buzz per press — the button owns its haptic, so a caller never stacks a second one.
 */
export function Button({ title, onPress, variant = 'primary', disabled, loading, haptic = 'tap', accessibilityLabel, accessibilityHint, className = '' }: Props) {
  const colors = useColors();
  const isOff = disabled || loading;
  return (
    <Press
      onPress={() => {
        if (haptic) haptics[haptic]();
        onPress();
      }}
      haptic={false}
      disabled={isOff}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!isOff, busy: !!loading }}
      style={{ opacity: isOff ? 0.6 : 1 }}
    >
      <View className={`min-h-[52px] rounded-md px-lg items-center justify-center ${shells[variant]} ${className}`}>
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? colors.onAccent : colors.accent} />
        ) : (
          <T variant="body" tone={labels[variant]} className="font-semibold">{title}</T>
        )}
      </View>
    </Press>
  );
}
