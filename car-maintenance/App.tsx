import 'react-native-gesture-handler'; // keep this FIRST
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import tw from './src/styles/tw';
import { AppStateProvider } from './src/state/AppState';
import { FontProvider } from './src/providers/FontProvider';
import { Pressable, Text } from 'react-native';
import { navRef } from './src/navigation/NavRef';
import { RootNavigator } from './src/navigation';

export default function App() {
  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <AppStateProvider>
        <FontProvider>
          <RootNavigator />
          <StatusBar style="auto" />
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
  );
}
