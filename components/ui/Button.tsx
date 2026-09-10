import { ActivityIndicator, View } from 'react-native';
import { Press } from './Press';
import { T } from './Text';
import { useColors } from '@/lib/theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
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

/** Every button in the Kit: spring press, light tap haptic, screen-reader role, 52pt minimum touch target. */
export function Button({ title, onPress, variant = 'primary', disabled, loading, accessibilityHint, className = '' }: Props) {
  const colors = useColors();
  const isOff = disabled || loading;
  return (
    <Press
      onPress={onPress}
      disabled={isOff}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!isOff, busy: !!loading }}
      style={{ opacity: isOff ? 0.6 : 1 }}
    >
      <View className={`min-h-[52px] rounded-md px-5 items-center justify-center ${shells[variant]} ${className}`}>
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? colors.onAccent : colors.accent} />
        ) : (
          <T variant="body" tone={labels[variant]} className="font-semibold">{title}</T>
        )}
      </View>
    </Press>
  );
}
