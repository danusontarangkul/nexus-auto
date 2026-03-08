import { useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppState } from '../state/AppState';
import { ROOT, RootStackParamList } from './routes';
import tw from '@/styles/tw';

export function Gate() {
  const { isAuthenticated, hasCar } = useAppState();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.reset({ index: 0, routes: [{ name: ROOT.Auth }] });
      return;
    }

    if (!hasCar) {
      navigation.reset({
        index: 0,
        routes: [{ name: ROOT.Onboarding }],
      });
      return;
    }

    navigation.reset({ index: 0, routes: [{ name: ROOT.App }] });
  }, [isAuthenticated, hasCar, navigation]);

  return <View style={tw`flex-1 bg-surface-950`} />;
}
