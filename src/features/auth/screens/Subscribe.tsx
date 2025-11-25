import React from 'react';
import { Screen } from '@/shared/components/Screen';
import { useAppState } from '../../../state/AppState';
import { View } from 'react-native';
import tw from '@/styles/tw';
import { CircleImage } from '@/shared/components/CircleImage';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';

export function Subscribe() {
  const { subscribe } = useAppState();
  const nav = useNavigation();

  return (
    <Screen>
      <View style={tw`items-center mt-10`}>
        <CircleImage
          source={require('../../../../assets/login-hero.jpg')}
          size={180}
        />
      </View>
      <View style={tw`mt-10`}>
        <PrimaryButton
          title="Subscribe"
          onPress={async () => {
            const { hasCar } = await subscribe();
            nav.reset({
              index: 0,
              routes: [
                { name: hasCar ? ('App' as never) : ('Onboarding' as never) },
              ],
            });
          }}
        />
      </View>
    </Screen>
  );
}
