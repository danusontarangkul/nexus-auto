import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VehiclePreviewCard } from '../components/car/VehiclePreviewCard';
import { PrimaryButton } from '@/shared/components/buttons/PrimaryButton';
import { useAppState } from '@/state/AppState';
import { Screen } from '@/shared/components/screens/Screen';
import { useVehicleParams } from '../hooks/useVehicleParams';
import { ScreenHeader } from '@/shared/components/headers/ScreenHeader';
import { ButtonContainer } from '@/shared/components/containers/ButtonContainer';
import { useCreateVehicle } from '@/domain/vehicles';
import { ActionGroup } from '@/shared/components/containers/ActionGroup';
import { ROOT, RootStackParamList } from '@/navigation/routes';

export function ConfirmCarScreen() {
  const { completeAddCar } = useAppState();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { car, plate, hasData, vinNumber } = useVehicleParams();

  const { createVehicle, isLoading, error } = useCreateVehicle();

  const handleConfirm = async () => {
    const vehicleId = await createVehicle({
      vehicleData: car,
      licensePlate: plate,
      vinNumber,
    });

    if (vehicleId) {
      completeAddCar();
      nav.reset({
        index: 0,
        routes: [{ name: ROOT.App }],
      });
    }
  };

  return (
    <Screen>
      <ScreenHeader title="Confirm Vehicle" />
      <VehiclePreviewCard car={car} plate={plate} />
      <ButtonContainer>
        <ActionGroup error={error}>
          <PrimaryButton
            title="Confirm"
            onPress={handleConfirm}
            isLoading={isLoading}
            disabled={!hasData}
          />
        </ActionGroup>
      </ButtonContainer>
    </Screen>
  );
}
