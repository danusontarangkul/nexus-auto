import 'react-native-gesture-handler'; // keep this FIRST
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import tw from './src/styles/tw';

export default function App() {
  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <RootNavigator />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
