import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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

validateEnv();

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

const convex = new ConvexReactClient(ENV.CONVEX_URL);

export default function App() {
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
