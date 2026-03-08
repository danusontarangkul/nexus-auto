import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/shared/components/screens/Screen';
import { Input } from '@/shared/components/inputs/Input';
import { PrimaryButton } from '@/shared/components/buttons/PrimaryButton';
import { ONBOARD, OnboardingStackParamList } from '@/navigation/routes';
import { getVehicleWithFallbacks } from '../utils/vehicle';
import tw from '@/styles/tw';
import { CustomText } from '@/shared/components/texts/CustomText';

export function EnterManualScreen() {
  const nav =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
  const [license, setLicense] = useState('');
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [year, setYear] = useState<string>('');

  const handleNext = () => {
    const { car, plate, vinNumber } = getVehicleWithFallbacks(
      {
        make: make || null,
        model: model || null,
        year: year ? parseInt(year, 10) : null,
      },
      license || undefined,
      'Manual entry',
    );
    nav.navigate(ONBOARD.ConfirmCar, { car, plate, vinNumber });
  };

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
        <PrimaryButton title="Next" onPress={handleNext} />
      </View>
    </Screen>
  );
}
