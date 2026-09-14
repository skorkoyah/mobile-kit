import { type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { spacing } from '@/constants/tokens';

type Props = {
  children: ReactNode;
  /** 'fixed' = no scrolling · 'scroll' = plain scroll · 'form' = keyboard-aware scroll (use whenever there is a TextInput). */
  mode?: 'fixed' | 'scroll' | 'form';
  className?: string;
};

/**
 * The outer shell of every screen: safe area + themed background + the right scroll container.
 * The keyboard-aware scroll view takes plain padding rather than a class, because it is not a
 * core React Native component and would silently ignore `className`.
 */
const pad = { paddingHorizontal: spacing.md, paddingBottom: spacing.xl } as const;

export function Screen({ children, mode = 'fixed', className = '' }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={mode === 'fixed' ? ['top', 'left', 'right', 'bottom'] : ['top', 'left', 'right']}>
      {mode === 'fixed' && <View className={`flex-1 px-md pb-xl ${className}`}>{children}</View>}
      {mode === 'scroll' && (
        <ScrollView contentContainerClassName={`px-md pb-xl ${className}`} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      )}
      {mode === 'form' && (
        <KeyboardAwareScrollView bottomOffset={24} contentContainerStyle={pad} keyboardShouldPersistTaps="handled">
          <View className={`flex-1 ${className}`}>{children}</View>
        </KeyboardAwareScrollView>
      )}
    </SafeAreaView>
  );
}
