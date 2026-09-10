import '../global.css';
import '@/lib/nativewind';

import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useNavigationTheme } from '@/lib/theme';

/**
 * The provider tree every Kit app shares: gestures → keyboard → navigation theme → screens.
 * Later Kit versions add the session listener (v1) and RevenueCat init (v2) here.
 */
export default function RootLayout() {
  const theme = useNavigationTheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <ThemeProvider value={theme}>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
