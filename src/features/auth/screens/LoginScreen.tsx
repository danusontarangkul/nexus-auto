import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@/shared/components/Screen';
import { CircleImage } from '@/shared/components/CircleImage';
import { GoogleButton } from '@/shared/components/GoogleButton';
import { useAppState } from '@/state/AppState';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';
import tw from '@/styles/tw';

export function LoginScreen() {
  const { subscribe } = useAppState();
  const nav = useNavigation();

  const handleAuthSuccess = useCallback(async () => {
    const { hasCar } = await subscribe();
    nav.reset({
      index: 0,
      routes: [{ name: (hasCar ? 'App' : 'Onboarding') as never }],
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
