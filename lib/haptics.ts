/**
 * The only file that talks to the haptics library.
 * Screens call haptics.success() etc., never the library, so swapping
 * expo-haptics for react-native-pulsar is a one-file change.
 */
import * as Haptics from 'expo-haptics';

const safe = (fn: () => Promise<void>) => () => {
  fn().catch(() => {
    /* haptics are best-effort: simulators and some Androids have none */
  });
};

export const haptics = {
  /** Every button or row press. Wired globally through PressablesConfig too. */
  tap: safe(() => Haptics.selectionAsync()),
  /** Toggle or option selected. */
  select: safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  /** Primary action confirmed (save, start). */
  confirm: safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  /** Something completed: session done, purchase, streak. Always fire on success. */
  success: safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  /** Invalid input or failed action. Always fire on error. */
  error: safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
  /** Threshold crossed, milestone, drag snap. */
  impact: safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),
};
