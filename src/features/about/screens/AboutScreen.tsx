import React, { useLayoutEffect } from 'react';
import { View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Screen } from '@/shared/components/Screen';
import { BackHeader } from '@/navigation/components/BackHeader';
import { useDashboardContext } from '@/providers/DashboardProvider';
import { StaticField } from '@/shared/components/texts/StaticField';
import tw from '@/styles/tw';
import { ButtonContainer } from '@/shared/components/ButtonContainer';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useConfirmModal } from '@/shared/hooks/useConfirmModal';
import { useDeleteVehicle } from '@/domain/vehicles';
import { ActionGroup } from '@/shared/components/ActionGroup';
import { AppTabsParamList, TABS } from '@/navigation/routes';

export function AboutScreen() {
  const navigation = useNavigation<NavigationProp<AppTabsParamList>>();
  const { dashboard } = useDashboardContext();
  const vehicle = dashboard?.active?.vehicle;
  const { showConfirm } = useConfirmModal();
  const { deleteVehicle, isLoading, error } = useDeleteVehicle();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => <BackHeader hideBack title="About" skipTopInset={true} />,
    });
  }, [navigation]);

  const handleDeletePress = () => {
    if (!vehicle?._id) return;
    showConfirm({
      title: 'Delete Vehicle',
      message:
        'Are you sure? This will permanently remove this vehicle and all its associated service records and documents.',
      confirmText: 'Delete Vehicle',
      onConfirm: async () => {
        navigation.navigate(TABS.Dashboard);

        const success = await deleteVehicle(vehicle?._id);
        if (success) {
          navigation.navigate(TABS.Dashboard);
        }
      },
    });
  };

  return (
    <Screen>
      <View style={tw`px-4 mt-6`}>
        <StaticField label="Vin Number" value={vehicle?.vinNumber} />
        <StaticField label="Make" value={vehicle?.vehicleData.make} />
        <StaticField label="Model" value={vehicle?.vehicleData.model} />
        <StaticField label="Year" value={vehicle?.vehicleData.year} />
      </View>
      <ButtonContainer>
        <ActionGroup error={error}>
          <PrimaryButton
            title="Delete Vehicle"
            onPress={handleDeletePress}
            style={tw`bg-red-600`}
            isLoading={isLoading}
          />
        </ActionGroup>
      </ButtonContainer>
    </Screen>
  );
}
