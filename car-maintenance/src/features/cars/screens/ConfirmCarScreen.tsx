import React from 'react';
import { View } from 'react-native';
import { Screen } from '../../../shared/components/Screen';
import { PrimaryButton } from '../../../shared/components/PrimaryButton';
import { useAppState } from '../../../state/AppState';
import tw from '../../../styles/tw';
import { CustomText } from '../../../shared/components/CustomText';

export function ConfirmCarScreen() {
  const { completeAddCar } = useAppState();

  return (
    <Screen>
      <View style={tw`mt-12 gap-4`}>
        <CustomText style={tw`text-2xl font-semibold text-ink-900`}>
          Confirm Vehicle
        </CustomText>
        {/* TODO: show fetched/parsed car summary here (VIN → make/model/year) */}
        <PrimaryButton
          title="Confirm & Continue"
          onPress={() => {
            // After successful create on backend
            completeAddCar();
          }}
        />
      </View>
    </Screen>
  );
}
