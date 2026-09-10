import { View } from 'react-native';
import { Press } from './Press';
import { T } from './Text';

type Props = { message?: string; onRetry?: () => void };

/** Inline, recoverable error. Keep cached content visible underneath; never a full-screen crash. */
export function ErrorBanner({ message = "Couldn't load", onRetry }: Props) {
  const inner = (
    <View className="flex-row items-center justify-between rounded-md px-4 py-3 bg-danger-soft dark:bg-d-danger-soft" accessibilityRole="alert">
      <T variant="small" tone="danger" className="font-semibold">{message}</T>
      {onRetry ? <T variant="small" tone="danger" className="font-semibold">Tap to retry</T> : null}
    </View>
  );
  if (!onRetry) return inner;
  return (
    <Press feedback="opacity" onPress={onRetry} accessibilityRole="button" accessibilityLabel={`${message}. Retry`}>
      {inner}
    </Press>
  );
}
