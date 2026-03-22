import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ConvexReactClient } from 'convex/react';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import Toast from 'react-native-toast-message';
import tw from './src/styles/tw';
import { FontProvider } from './src/providers/FontProvider';
import { RootNavigator } from './src/navigation';
import { ENV } from './src/utils/env';
import { DevFloatingButton } from '@/shared/components/buttons/DevFloatingButton';
import { convexSecureStorage } from './src/utils/storage';
import { bootstrap } from '@/utils/bootstrap';

bootstrap();

const convex = new ConvexReactClient(ENV.CONVEX_URL);

export default function App() {
  return (
    <ConvexAuthProvider client={convex} storage={convexSecureStorage}>
      <GestureHandlerRootView style={tw`flex-1`}>
        <FontProvider>
          <RootNavigator />
          <StatusBar style="auto" />
          {__DEV__ && <DevFloatingButton />}
          <Toast />
        </FontProvider>
      </GestureHandlerRootView>
    </ConvexAuthProvider>
  );
}
