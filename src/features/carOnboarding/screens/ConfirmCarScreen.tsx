import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/shared/components/screens/Screen';
import { VehiclePreviewCard } from '../components/car/VehiclePreviewCard';
import { ButtonContainer } from '@/shared/components/containers/ButtonContainer';
import { ActionGroup } from '@/shared/components/containers/ActionGroup';
import { PrimaryButton } from '@/shared/components/buttons/PrimaryButton';
import { useVehicleParams } from '../hooks/useVehicleParams';
import { useCreateVehicle } from '@/domain/vehicles';
import {
  DASHBOARD,
  ONBOARD,
  OnboardingStackParamList,
  ROOT,
  RootStackParamList,
  TABS,
} from '@/navigation/routes';
import tw from '@/styles/tw';
import { View } from 'react-native';

export function ConfirmCarScreen() {
  const { car, plate, hasData, vinNumber } = useVehicleParams();
  const { createVehicle, isLoading, error } = useCreateVehicle();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<
        OnboardingStackParamList,
        typeof ONBOARD.ConfirmCar
      >
    >();

  const handleConfirm = async () => {
    const vehicleId = await createVehicle({
      vehicleData: car,
      licensePlate: plate,
      vinNumber,
    });

    if (!vehicleId) {
      return;
    }

    const rootNav =
      navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    if (rootNav?.canGoBack()) {
      rootNav.navigate(ROOT.App, {
        screen: TABS.Dashboard,
        params: { screen: DASHBOARD.DashboardMain },
      });
    }
  };

  return (
    <Screen>
      <View style={tw`mt-10`}>
        <VehiclePreviewCard car={car} plate={plate} />
        <ButtonContainer>
          <ActionGroup error={error}>
            <PrimaryButton
              title="Confirm Vehicle"
              onPress={handleConfirm}
              isLoading={isLoading}
              disabled={!hasData}
            />
          </ActionGroup>
        </ButtonContainer>
      </View>
    </Screen>
  );
}
