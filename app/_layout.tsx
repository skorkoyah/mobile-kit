import '../global.css';
import '@/lib/nativewind';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useColors } from '@/lib/theme';

/**
 * The provider tree every Kit app shares: gestures → keyboard → navigation.
 * Later Kit versions add the session listener (v1) and RevenueCat init (v2) here.
 */
export default function RootLayout() {
  const colors = useColors();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
