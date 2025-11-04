import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../../shared/components/Screen';
import { View } from 'react-native';
import { PrimaryButton } from '../../../shared/components/PrimaryButton';
import tw from '../../../styles/tw';
import { CustomText } from '../../../shared/components/CustomText';

export function AddCarStartScreen() {
  const nav = useNavigation();

  return (
    <Screen>
      <View style={tw`mt-12 gap-4`}>
        <CustomText style={tw`text-2xl font-semibold text-ink-900`}>Add a Car</CustomText>
        <PrimaryButton
          title="Enter VIN"
          onPress={() => nav.navigate('EnterVIN' as never)}
        />
        <PrimaryButton
          title="Enter Manually"
          style={tw`bg-white border border-slate-200`}
          onPress={() => nav.navigate('EnterManual' as never)}
        />
        <PrimaryButton
          title="Scan VIN Barcode"
          style={tw`bg-white border border-slate-200`}
          onPress={() => nav.navigate('UploadVINPhoto' as never)}
        />
      </View>
    </Screen>
  );
}
