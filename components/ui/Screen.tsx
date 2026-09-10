import { type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

type Props = {
  children: ReactNode;
  /** 'fixed' = no scrolling · 'scroll' = plain scroll · 'form' = keyboard-aware scroll (use whenever there is a TextInput). */
  mode?: 'fixed' | 'scroll' | 'form';
  className?: string;
};

/** The outer shell of every screen: safe area + themed background + the right scroll container. */
export function Screen({ children, mode = 'fixed', className = '' }: Props) {
  const inner = `px-4 pb-8 ${className}`;
  return (
    <SafeAreaView className="flex-1 bg-background" edges={mode === 'fixed' ? ['top', 'left', 'right', 'bottom'] : ['top', 'left', 'right']}>
      {mode === 'fixed' && <View className={`flex-1 ${inner}`}>{children}</View>}
      {mode === 'scroll' && (
        <ScrollView contentContainerClassName={inner} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      )}
      {mode === 'form' && (
        <KeyboardAwareScrollView bottomOffset={24} contentContainerClassName={inner} keyboardShouldPersistTaps="handled">
          {children}
        </KeyboardAwareScrollView>
      )}
    </SafeAreaView>
  );
}
