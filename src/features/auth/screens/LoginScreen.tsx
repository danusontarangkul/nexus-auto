import { useCallback } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/shared/components/screens/Screen';
import { CircleImage } from '@/shared/components/image/CircleImage';
import { GoogleButton } from '@/shared/components/buttons/GoogleButton';
import { ROOT, RootStackParamList } from '@/navigation/routes';
import { useAppState } from '@/state/AppState';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';
import tw from '@/styles/tw';

export function LoginScreen() {
  const { subscribe } = useAppState();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleAuthSuccess = useCallback(async () => {
    const { hasCar } = await subscribe();
    nav.reset({
      index: 0,
      routes: [{ name: hasCar ? ROOT.App : ROOT.Onboarding }],
    });
  }, [nav, subscribe]);

  const { loginWithGoogle, isLoading } = useGoogleAuth(handleAuthSuccess);

  return (
    <Screen>
      <View style={tw`items-center mt-10`}>
        <CircleImage source={require('@assets/login-hero.jpg')} size={180} />
      </View>

      <View style={tw`mt-12 px-4`}>
        <GoogleButton onPress={loginWithGoogle} isLoading={isLoading} />
      </View>
    </Screen>
  );
}
