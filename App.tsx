import React from 'react';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Pressable, Text } from 'react-native';

// Convex & Auth
import { ConvexReactClient } from 'convex/react';
import { ConvexAuthProvider } from '@convex-dev/auth/react';

import * as SecureStore from 'expo-secure-store';

// Internal Imports
import tw from './src/styles/tw';
import { AppStateProvider } from './src/state/AppState';
import { FontProvider } from './src/providers/FontProvider';
import { navRef } from './src/navigation/NavRef';
import { RootNavigator } from './src/navigation';
import { validateEnv, ENV } from './src/utils/env';

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

            {/* Dev Floating Button */}
            {__DEV__ && (
              <Pressable
                onPress={() =>
                  navRef.isReady() && navRef.navigate('__DEV__' as never)
                }
                style={{
                  position: 'absolute',
                  top: 60,
                  right: 10,
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  backgroundColor: 'rgba(60,60,60,0.7)',
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>DEV</Text>
              </Pressable>
            )}
          </FontProvider>
        </AppStateProvider>
      </GestureHandlerRootView>
    </ConvexAuthProvider>
  );
}
