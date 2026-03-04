import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { VehiclePreviewCard } from '../components/car/VehiclePreviewCard';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useAppState } from '@/state/AppState';
import { Screen } from '@/shared/components/Screen';
import { useVehicleParams } from '../hooks/useVehicleParams';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { ButtonContainer } from '@/shared/components/ButtonContainer';
import { useCreateVehicle } from '@/domain/vehicles';
import { ActionGroup } from '@/shared/components/ActionGroup';

export function ConfirmCarScreen() {
  const { completeAddCar } = useAppState();
  const nav = useNavigation();

  const { car, plate, hasData, vinNumber } = useVehicleParams();

  const { createVehicle, isLoading, error } = useCreateVehicle();

  // Test Vin: 1HGCM82633A004352

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
        routes: [{ name: 'App' as never }],
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
