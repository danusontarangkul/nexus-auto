import React from 'react';
import { View, Image } from 'react-native';
import { Screen } from '../../../shared/components/Screen';
import { PrimaryButton } from '../../../shared/components/PrimaryButton';
import { useAppState } from '../../../state/AppState';
import { CustomText } from '../../../shared/components/CustomText';
import tw from '../../../styles/tw';
import { useNavigation } from '@react-navigation/native';

export function ConfirmCarScreen() {
  const { completeAddCar } = useAppState();
  const nav = useNavigation<any>();

  // Mocked car data — replace later with API/Convex data
  const car = {
    make: 'Tesla',
    model: 'Model 3',
    year: '2022',
    color: 'Pearl White Multi-Coat',
    vin: '5YJ3E1EA5KF317123',
    plate: '7XYZ123',
  };

  return (
    <Screen>
      {/* Title */}
      <CustomText variant="titleXL" color={tw.color('ink-900') as string}>
        Confirm Vehicle
      </CustomText>

      {/* Car card */}
      <View
        style={tw`bg-[#363434] rounded-xl mt-6 p-4 border border-surface-border`}
      >
        <Image
          source={require('../../../../assets/tesla-model-3.avif')}
          style={tw`w-full h-40 rounded-lg mb-4`}
          resizeMode="cover"
        />
        <CustomText variant="titleLg" color={tw.color('ink-900') as string}>
          {`${car.year} ${car.make} ${car.model}`}
        </CustomText>
        <CustomText color={tw.color('ink-700') as string}>
          Color: {car.color}
        </CustomText>
        <CustomText color={tw.color('ink-700') as string}>
          VIN: {car.vin}
        </CustomText>
        <CustomText color={tw.color('ink-700') as string}>
          Plate: {car.plate}
        </CustomText>
      </View>

      {/* Buttons */}
      <View style={tw`mt-10 gap-4`}>
        <PrimaryButton
          title="Confirm & Continue"
          onPress={() => {
            // future: API call -> success -> go to dashboard
            completeAddCar();
            nav.reset({
              index: 0,
              routes: [{ name: 'App' as never }],
            });
          }}
        />
        <PrimaryButton
          title="Edit Info"
          style={tw`bg-transparent border border-surface-border`}
          onPress={() => {
            // for now go back to previous page (manual or VIN entry)
            // later we could open the edit form again
          }}
        />
      </View>
    </Screen>
  );
}
