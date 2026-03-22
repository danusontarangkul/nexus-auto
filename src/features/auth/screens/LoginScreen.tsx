import { View } from 'react-native';
import { Screen } from '@/shared/components/screens/Screen';
import { CircleImage } from '@/shared/components/image/CircleImage';
import { GoogleButton } from '@/shared/components/buttons/GoogleButton';
import { AppleButton } from '@/shared/components/buttons/AppleButton';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';
import { useAppleAuth } from '../hooks/useAppleAuth';
import tw from '@/styles/tw';

export function LoginScreen() {
  const { loginWithGoogle, isLoading: isLoadingGoogle } = useGoogleAuth();
  const { loginWithApple, isLoading: isLoadingApple } = useAppleAuth();

  return (
    <Screen>
      <View style={tw`flex-1 w-full justify-center gap-12`}>
        <View style={tw`items-center`}>
          <CircleImage source={require('@assets/icon.png')} size={180} />
        </View>

        <View style={tw`gap-2`}>
          <GoogleButton onPress={loginWithGoogle} isLoading={isLoadingGoogle} />
          <AppleButton onPress={loginWithApple} isLoading={isLoadingApple} />
        </View>
      </View>
    </Screen>
  );
}
