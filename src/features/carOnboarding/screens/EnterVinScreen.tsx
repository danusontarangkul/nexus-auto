import { useState } from 'react';
import { View } from 'react-native';
import { Screen } from '@/shared/components/screens/Screen';
import { Input } from '@/shared/components/inputs/Input';
import { PrimaryButton } from '@/shared/components/buttons/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import tw from '@/styles/tw';
import { CustomText } from '@/shared/components/texts/CustomText';

export function EnterVinScreen() {
  const nav = useNavigation() ;
  const [vin, setVin] = useState<string>('');

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
