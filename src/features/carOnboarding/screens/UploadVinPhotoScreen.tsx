import React from 'react';
import { View } from 'react-native';
import { Screen } from '../../../shared/components/Screen';
import { PrimaryButton } from '../../../shared/components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import tw from '../../../styles/tw';
import { CustomText } from '../../../shared/components/CustomText';

export function UploadVinPhotoScreen() {
  const nav = useNavigation();
  return (
    <Screen>
      <View style={tw`mt-12 gap-4`}>
        <CustomText style={tw`text-2xl font-semibold text-ink-900`}>
          Scan VIN Barcode
        </CustomText>
        <PrimaryButton
          title="Simulate Scan → Next"
          onPress={() => nav.navigate('ConfirmCar' as never)}
        />
      </View>
    </Screen>
  );
}
