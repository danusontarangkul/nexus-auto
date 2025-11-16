// src/navigation/DevSwitcher.tsx
import React from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { Screen } from '../../shared/components/Screen';
import tw from '../../styles/tw';
import { ONBOARD } from '../routes';

// This component provides buttons to quickly navigate to different parts of the app during development.
export default function DevSwitcher() {
  const nav = useNavigation<any>();
  return (
    <Screen>
      <ScrollView contentContainerStyle={tw`gap-3 mt-40`}>
        <PrimaryButton
          title="Auth → Login"
          onPress={() => nav.reset({ index: 0, routes: [{ name: 'Auth' }] })}
        />
        <PrimaryButton
          title="Onboarding → AddCarStart"
          onPress={() =>
            nav.reset({ index: 0, routes: [{ name: 'Onboarding' }] })
          }
        />
        <PrimaryButton
          title="Scan Vin Screen"
          onPress={() =>
            nav.reset({
              index: 0,
              routes: [
                { name: 'Onboarding', params: { screen: ONBOARD.VinScan } },
              ],
            })
          }
        />
        <PrimaryButton
          title="Onboarding → ConfirmCar"
          onPress={() =>
            nav.reset({
              index: 0,
              routes: [
                { name: 'Onboarding', params: { screen: 'ConfirmCar' } },
              ],
            })
          }
        />

        <PrimaryButton
          title="App → Dashboard"
          onPress={() => nav.reset({ index: 0, routes: [{ name: 'App' }] })}
        />
      </ScrollView>
    </Screen>
  );
}
