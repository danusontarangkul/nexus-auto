import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/shared/components/screens/Screen';
import { PrimaryButton } from '@/shared/components/buttons/PrimaryButton';
import tw from '@/styles/tw';
import { CustomText } from '@/shared/components/texts/CustomText';
import { ONBOARD, OnboardingStackParamList } from '@/navigation/routes';
import { getVehicleWithFallbacks } from '../utils/vehicle';

export function UploadVinPhotoScreen() {
  const nav =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const handleSimulateScan = () => {
    const { car, plate, vinNumber } = getVehicleWithFallbacks();
    nav.navigate(ONBOARD.ConfirmCar, { car, plate, vinNumber });
  };

  return (
    <Screen>
      <View style={tw`mt-12 gap-4`}>
        <CustomText style={tw`text-2xl font-semibold text-ink-900`}>
          Scan VIN Barcode
        </CustomText>
        <PrimaryButton
          title="Simulate Scan → Next"
          onPress={handleSimulateScan}
        />
      </View>
    </Screen>
  );
}
