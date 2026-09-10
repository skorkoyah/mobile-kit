import { type ReactNode } from 'react';
import { View } from 'react-native';
import { Press } from './Press';
import { T } from './Text';

type Props = {
  title: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  onPress?: () => void;
  accessibilityHint?: string;
};

/** A list row: title, optional subtitle, optional left/right slots. Tappable when `onPress` is given. */
export function Row({ title, subtitle, left, right, onPress, accessibilityHint }: Props) {
  const body = (
    <View className="flex-row items-center gap-3 py-3 px-1 border-b border-border dark:border-d-border">
      {left}
      <View className="flex-1">
        <T variant="body" className="font-semibold">{title}</T>
        {subtitle ? <T variant="small" tone="ink2">{subtitle}</T> : null}
      </View>
      {right}
    </View>
  );
  if (!onPress) return body;
  return (
    <Press onPress={onPress} accessibilityRole="button" accessibilityLabel={title} accessibilityHint={accessibilityHint}>
      {body}
    </Press>
  );
}
