import { useCallback } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/shared/components/screens/Screen';
import { CircleImage } from '@/shared/components/image/CircleImage';
import { GoogleButton } from '@/shared/components/buttons/GoogleButton';
import { ROOT, RootStackParamList } from '@/navigation/routes';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';
import tw from '@/styles/tw';
import { useAppleAuth } from '../hooks/useAppleAuth';
import { AppleButton } from '@/shared/components/buttons/AppleButton';

export function LoginScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleAuthSuccess = useCallback(async () => {
    nav.reset({ index: 0, routes: [{ name: ROOT.App }] });
  }, [nav]);

  const { loginWithGoogle, isLoading: isLoadingGoogle } =
    useGoogleAuth(handleAuthSuccess);
  const { loginWithApple, isLoading: isLoadingApple } =
    useAppleAuth(handleAuthSuccess);

  return (
    <Screen>
      <View style={tw`items-center mt-10`}>
        <CircleImage source={require('@assets/icon.png')} size={180} />
      </View>

      <View style={tw`mt-12 gap-2`}>
        <GoogleButton onPress={loginWithGoogle} isLoading={isLoadingGoogle} />
        <AppleButton onPress={loginWithApple} isLoading={isLoadingApple} />
      </View>
    </Screen>
  );
}
