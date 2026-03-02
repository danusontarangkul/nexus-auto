import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@/shared/components/Screen';
import { Input } from '@/shared/components/Input';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { CustomText } from '@/shared/components/CustomText';
import tw from '@/styles/tw';
import { useAppState } from '@/state/AppState';
import { ONBOARD } from '@/navigation/routes';
import {
  getVinHelperMessage,
  validateVinOnSubmit,
  VIN_LENGTH,
  sanitizeVinInput,
} from '../utils/vin';
import { VinScanLink } from '../components/VinScanLink';
import { useDecodeVin } from '@/domain/vin';
import { InputGroup } from '@/shared/components/InputGroup';
import { MAX_PLATE_LENGTH, sanitizePlateInput } from '../utils/licensepPlate';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { ButtonContainer } from '@/shared/components/ButtonContainer';
import { sanitizeCapitalizeString } from '@convex/utils/sanatize';
import { ActionGroup } from '@/shared/components/ActionGroup';

export function AddCarStartScreen() {
  const nav = useNavigation();
  const [plate, setPlate] = useState<string>('');
  const [vin, setVin] = useState<string>('');
  const [vinMessage, setVinMessage] = useState<string>('');
  const [vinError, setVinError] = useState<string | null>(null);

  const { completeAddCar } = useAppState();

  const {
    decodeVin,
    isLoading: isDecoding,
    error: decodeError,
    setError: setDecodeError,
  } = useDecodeVin();

  const handleVinChange = (value: string) => {
    const sanitized = sanitizeVinInput(value);

    setVin(sanitized);

    setVinMessage(getVinHelperMessage(sanitized));

    if (vinError) {
      setVinError(null);
    }
    if (decodeError) {
      setDecodeError(null);
    }
  };

  const handlePlateChange = (value: string) => {
    const sanitized = sanitizePlateInput(value);
    setPlate(sanitized);
  };

  const handleSubmit = async () => {
    const error = validateVinOnSubmit(vin);

    if (error) {
      setVinError(error);
      return;
    }

    const result = await decodeVin({ vin });

    if (!result) {
      return;
    }

    completeAddCar();
    nav.navigate(ONBOARD.ConfirmCar, {
      car: result,
      plate: plate,
      vinNumber: sanitizeCapitalizeString(vin),
    });
  };

  const isSubmitReady = vin.length === VIN_LENGTH && plate.length !== 0;

  return (
    <Screen>
      <ScreenHeader title="Enter Car Details" />
      <InputGroup>
        <Input
          label="License Plate #"
          placeholder="License Plate #"
          autoCapitalize="characters"
          value={plate}
          onChangeText={handlePlateChange}
          maxLength={MAX_PLATE_LENGTH}
          onClear={() => handlePlateChange('')}
        />
        <Input
          label="VIN"
          placeholder="VIN"
          autoCapitalize="characters"
          value={vin}
          onChangeText={handleVinChange}
          maxLength={VIN_LENGTH}
          errorText={vinError}
          helperText={vinMessage}
          onClear={() => handleVinChange('')}
        />
      </InputGroup>
      <View style={tw`mb-8 mt-6`}>
        <CustomText variant="titleLg" color={tw.color('ink-900')}>
          Or
        </CustomText>
      </View>
      <VinScanLink onPress={() => nav.navigate(ONBOARD.VinScan)} />
      <ButtonContainer>
        <ActionGroup error={decodeError}>
          <PrimaryButton
            title="Submit"
            style={tw`rounded-xl py-4`}
            onPress={handleSubmit}
            disabled={!isSubmitReady}
            isLoading={isDecoding}
          />
        </ActionGroup>
      </ButtonContainer>
    </Screen>
  );
}
