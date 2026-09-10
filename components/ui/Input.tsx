import { TextInput, type TextInputProps, View } from 'react-native';
import { T } from './Text';
import { useColors } from '@/lib/theme';
import { type } from '@/constants/tokens';

type Props = TextInputProps & {
  label: string;
  /** Short help under the field. Replaced by `error` when set. */
  hint?: string;
  error?: string;
};

/**
 * A labeled text field. Themed border, 48pt tall, the label doubles as the screen-reader label,
 * and an error turns the border red and is announced. Put it inside `Screen mode="form"` so the
 * keyboard never covers it.
 */
export function Input({ label, hint, error, className = '', style, ...rest }: Props) {
  const colors = useColors();
  return (
    <View className="gap-1.5">
      <T variant="small" tone="ink2" className="font-semibold">{label}</T>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={error ?? hint}
        placeholderTextColor={colors.muted}
        className={`min-h-[48px] rounded-md px-4 bg-surface text-ink border ${error ? 'border-danger' : 'border-border'} ${className}`}
        style={[{ fontSize: type.body.size }, style]}
        {...rest}
      />
      {error ? (
        <T variant="small" tone="danger" accessibilityLiveRegion="polite">{error}</T>
      ) : hint ? (
        <T variant="small" tone="muted">{hint}</T>
      ) : null}
    </View>
  );
}
