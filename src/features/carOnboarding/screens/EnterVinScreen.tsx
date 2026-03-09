import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/shared/components/screens/Screen';
import { Input } from '@/shared/components/inputs/Input';
import { PrimaryButton } from '@/shared/components/buttons/PrimaryButton';
import tw from '@/styles/tw';
import { CustomText } from '@/shared/components/texts/CustomText';
import { ONBOARD, OnboardingStackParamList } from '@/navigation/routes';
import { useDecodeVin } from '@/domain/vin';
import {
  sanitizeVinInput,
  validateVinOnSubmit,
  VIN_LENGTH,
} from '../utils/vin';
import { sanitizeCapitalizeString } from '@convex/utils/sanatize';
import { ActionGroup } from '@/shared/components/containers/ActionGroup';

export function EnterVinScreen() {
  const nav =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
  const [vin, setVin] = useState<string>('');
  const [vinError, setVinError] = useState<string | null>(null);

  const {
    decodeVin,
    isLoading,
    error: decodeError,
    setError: setDecodeError,
  } = useDecodeVin();

  const handleVinChange = (value: string) => {
    setVin(sanitizeVinInput(value));
    if (vinError) setVinError(null);
    if (decodeError) setDecodeError(null);
  };

  const handleNext = async () => {
    const error = validateVinOnSubmit(vin);
    if (error) {
      setVinError(error);
      return;
    }
    const car = await decodeVin({ vin });
    if (!car) return;
    nav.navigate(ONBOARD.ConfirmCar, {
      car,
      plate: '',
      vinNumber: sanitizeCapitalizeString(vin),
    });
  };

  const isNextReady = vin.length === VIN_LENGTH;

  return (
    <Screen>
      <View style={tw`mt-12 gap-4`}>
        <CustomText style={tw`text-2xl font-semibold text-ink-900`}>
          Enter VIN
        </CustomText>
        <Input
          placeholder="VIN"
          value={vin}
          onChangeText={handleVinChange}
          autoCapitalize="characters"
          maxLength={VIN_LENGTH}
          errorText={vinError}
        />
        <ActionGroup error={decodeError}>
          <PrimaryButton
            title="Next"
            onPress={handleNext}
            disabled={!isNextReady}
            isLoading={isLoading}
          />
        </ActionGroup>
      </View>
    </Screen>
  );
}
