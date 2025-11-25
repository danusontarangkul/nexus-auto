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

// VIN utilities
import {
  getVinHelperMessage,
  validateVinOnSubmit,
  normalizeVin,
} from '../../cars/utils/vin';

// Convex domain hook
import { useDecodeVin } from '../../../../domain/vin'; // adjust path/alias if needed

export function AddCarStartScreen() {
  const nav = useNavigation();
  const [plate, setPlate] = useState('');
  const [vin, setVin] = useState('');
  const [vinMessage, setVinMessage] = useState('');
  const [vinError, setVinError] = useState<string | null>(null);

  const { completeAddCar } = useAppState();

  // convex hook
  const {
    decodeVin,
    isLoading: isDecoding,
    error: decodeError,
    setError: setDecodeError,
  } = useDecodeVin();

  const handleVinChange = (value: string) => {
    const upper = normalizeVin(value);
    setVin(upper);

    if (!upper) {
      setVinMessage('');
      setVinError(null);
      // clear convex-level error too when user starts over
      setDecodeError(null);
      return;
    }

    setVinMessage(getVinHelperMessage(upper));

    if (vinError) {
      setVinError(null);
    }

    if (decodeError) {
      setDecodeError(null);
    }
  };

  const handleSubmit = async () => {
    const error = validateVinOnSubmit(vin);

    if (error) {
      setVinError(error);
      return;
    }

    try {
      // 🔌 Call Convex action via the hook
      const result = await decodeVin({ vin }); // adjust shape if DecodeVinInput needs more

      if (!result) {
        // Convex hook already set `decodeError`, so surface that here if needed
        setVinError(
          decodeError ?? 'Unable to decode this VIN. Please try again.',
        );
        return;
      }

      // TODO: later you can stash `result` in app state or navigate with params
      console.log('Decoded VIN result:', result);

      completeAddCar();
      nav.navigate('ConfirmCar' as never);
    } catch (e) {
      console.error('Unexpected error decoding VIN:', e);
      setVinError('There was a problem decoding this VIN. Please try again.');
    }
  };

  const isSubmitting = isDecoding; // for now just tie button to convex loading

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

        <View>
          <Input
            label="VIN"
            placeholder="VIN"
            autoCapitalize="characters"
            value={vin}
            onChangeText={handleVinChange}
          />

          {/* Only one message at a time: error beats helper */}
          {vinError ? (
            <CustomText
              variant="detail"
              color={tw.color('ink-900') as string} // swap to error color later
              style={tw`mt-1`}
            >
              {vinError}
            </CustomText>
          ) : vinMessage ? (
            <CustomText
              variant="detail"
              color={tw.color('ink-700') as string}
              style={tw`mt-1`}
            >
              {vinMessage}
            </CustomText>
          ) : null}
        </View>
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
          title={isSubmitting ? 'Decoding…' : 'Submit'}
          style={tw`rounded-xl py-4`}
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
      </View>
    </Screen>
  );
}
