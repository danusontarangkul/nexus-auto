import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../../shared/components/Screen';
import { Input } from '../../../shared/components/Input';
import { PrimaryButton } from '../../../shared/components/PrimaryButton';
import { CustomText } from '../../../shared/components/CustomText';
import { Ionicons } from '@expo/vector-icons';
import tw from '../../../styles/tw';
import { useAppState } from '../../../state/AppState';
import { ONBOARD } from '../../../navigation/routes';

export function AddCarStartScreen() {
  const nav = useNavigation();
  const [plate, setPlate] = useState('');
  const [vin, setVin] = useState('');
  const { completeAddCar } = useAppState();

  return (
    <Screen>
      <CustomText variant="titleXL" color={tw.color('ink-900') as string}>
        Enter Car Details–Manually
      </CustomText>

      <View style={tw`mt-6 gap-5`}>
        <Input
          label="License Plate #"
          placeholder="License Plate #"
          autoCapitalize="characters"
          value={plate}
          onChangeText={setPlate}
          editable={false}
        />
        <Input
          label="VIN"
          placeholder="VIN"
          autoCapitalize="characters"
          value={vin}
          onChangeText={setVin}
        />
      </View>

      <View style={tw`my-8`}>
        <CustomText variant="titleLg" color={tw.color('ink-900') as string}>
          Or
        </CustomText>
      </View>

      <TouchableOpacity
        style={tw`flex-row items-center`}
        onPress={() => nav.navigate(ONBOARD.VinScan as never)}
      >
        <Ionicons
          name="camera-outline"
          size={22}
          color={tw.color('ink-900') as string}
        />
        <CustomText
          variant="link"
          color={tw.color('ink-900') as string}
          style={tw`underline ml-3`}
        >
          Upload Photo of VIN Barcode
        </CustomText>
      </TouchableOpacity>

      <View style={tw`mt-12`}>
        <PrimaryButton
          title="Submit"
          style={tw`rounded-xl py-4`}
          onPress={async () => {
            completeAddCar();
            nav.navigate('ConfirmCar' as never);
          }}
        />
      </View>
    </Screen>
  );
}
