import React, { useState } from 'react';
import { View } from 'react-native';
import { Screen } from '../../../shared/components/Screen';
import { Input } from '../../../shared/components/Input';
import { PrimaryButton } from '../../../shared/components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import tw from '../../../styles/tw';
import { CustomText } from '../../../shared/components/CustomText';

export function EnterManualScreen() {
  const nav = useNavigation();
  const [license, setLicense] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');

  return (
    <Screen>
      <View style={tw`mt-12 gap-4`}>
        <CustomText style={tw`text-2xl font-semibold text-ink-900`}>
          Enter Details Manually
        </CustomText>
        <Input
          placeholder="License Plate #"
          value={license}
          onChangeText={setLicense}
        />
        <Input placeholder="Make" value={make} onChangeText={setMake} />
        <Input placeholder="Model" value={model} onChangeText={setModel} />
        <Input
          placeholder="Year"
          value={year}
          onChangeText={setYear}
          keyboardType="number-pad"
        />
        <PrimaryButton
          title="Next"
          onPress={() => nav.navigate('ConfirmCar' as never)}
        />
      </View>
    </Screen>
  );
}
