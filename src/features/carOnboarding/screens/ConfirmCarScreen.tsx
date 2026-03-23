import { Screen } from '@/shared/components/screens/Screen';
import { ScreenHeader } from '@/shared/components/headers/ScreenHeader';
import { VehiclePreviewCard } from '../components/car/VehiclePreviewCard';
import { ButtonContainer } from '@/shared/components/containers/ButtonContainer';
import { ActionGroup } from '@/shared/components/containers/ActionGroup';
import { PrimaryButton } from '@/shared/components/buttons/PrimaryButton';
import { useVehicleParams } from '../hooks/useVehicleParams';
import { useCreateVehicle } from '@/domain/vehicles';
import tw from '@/styles/tw';

export function ConfirmCarScreen() {
  const { car, plate, hasData, vinNumber } = useVehicleParams();
  const { createVehicle, isLoading, error } = useCreateVehicle();

  const handleConfirm = async () => {
    await createVehicle({
      vehicleData: car,
      licensePlate: plate,
      vinNumber,
    });
  };

  return (
    <Screen>
      <ScreenHeader title="Confirm Vehicle" style={tw`mt-10`} />
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
    </Screen>
  );
}
