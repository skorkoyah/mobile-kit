import { View } from 'react-native';
import { Button } from './Button';
import { T } from './Text';

type Props = {
  /** One emoji or a short glyph. Keep it friendly. */
  icon?: string;
  title: string;
  body: string;
  /** The one action that moves the user forward. Never leave a dead end. */
  action?: { title: string; onPress: () => void };
};

/** A designed empty state: what this is, why it's empty, and the next step. */
export function EmptyState({ icon = '✨', title, body, action }: Props) {
  return (
    <View className="flex-1 items-center justify-center px-6 gap-3">
      <T variant="display" accessibilityElementsHidden importantForAccessibility="no" accessibilityRole={undefined}>{icon}</T>
      <T variant="heading" className="text-center">{title}</T>
      <T variant="body" tone="ink2" className="text-center max-w-[32ch]">{body}</T>
      {action ? (
        <View className="mt-3 self-stretch">
          <Button title={action.title} onPress={action.onPress} />
        </View>
      ) : null}
    </View>
  );
}
