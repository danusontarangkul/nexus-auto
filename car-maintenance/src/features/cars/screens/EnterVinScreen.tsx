import React, { useState } from 'react';
import { View } from 'react-native';
import { Screen } from '../../../shared/components/Screen';
import { Input } from '../../../shared/components/Input';
import { PrimaryButton } from '../../../shared/components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import tw from '../../../styles/tw';
import { CustomText } from '../../../shared/components/CustomText';

export function EnterVinScreen() {
  const nav = useNavigation();
  const [vin, setVin] = useState('');

  return (
    <Screen>
      <View style={tw`mt-12 gap-4`}>
        <CustomText style={tw`text-2xl font-semibold text-ink-900`}>
          Enter VIN
        </CustomText>
        <Input
          placeholder="VIN"
          value={vin}
          onChangeText={setVin}
          autoCapitalize="characters"
        />
        <PrimaryButton
          title="Next"
          onPress={() => nav.navigate('ConfirmCar' as never)}
        />
      </View>
    </Screen>
  );
}
