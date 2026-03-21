import 'react-native-gesture-handler';
import { useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';

// Convex & Auth
import { ConvexReactClient } from 'convex/react';
import { ConvexAuthProvider } from '@convex-dev/auth/react';

import * as SecureStore from 'expo-secure-store';

// Internal Imports
import tw from './src/styles/tw';
import { AppStateProvider } from './src/state/AppState';
import { FontProvider } from './src/providers/FontProvider';
import { RootNavigator } from './src/navigation';
import { validateEnv, ENV } from './src/utils/env';
import Toast from 'react-native-toast-message';
import { DevFloatingButton } from '@/shared/components/buttons/DevFloatingButton';

SplashScreen.preventAutoHideAsync().catch(() => {});

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

function useConvexClientSafely(): ConvexReactClient | null {
  return useMemo(() => {
    try {
      validateEnv();
      return new ConvexReactClient(ENV.CONVEX_URL);
    } catch (e) {
      console.error('[App] Environment validation failed:', e);
      return null;
    }
  }, []);
}

export default function App() {
  const convex = useConvexClientSafely();

  useEffect(() => {
    if (convex === null) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [convex]);

  if (convex === null) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-surface-950 px-6`}>
        <Text style={tw`mb-3 text-center text-lg font-semibold text-red-400`}>
          Configuration error
        </Text>
        <Text style={tw`text-center text-base text-slate-400`}>
          Convex URL resolved to empty (unexpected). Set EXPO_PUBLIC_CONVEX_URL
          in .env.local or in eas.json for your EAS profile, or update
          src/config/publicEnv.ts defaults.
        </Text>
      </View>
    );
  }

  return (
    <ConvexAuthProvider client={convex} storage={secureStorage}>
      <GestureHandlerRootView style={tw`flex-1`}>
        <AppStateProvider>
          <FontProvider>
            <RootNavigator />
            <StatusBar style="auto" />
            {__DEV__ && <DevFloatingButton />}
            <Toast />
          </FontProvider>
        </AppStateProvider>
      </GestureHandlerRootView>
    </ConvexAuthProvider>
  );
}
