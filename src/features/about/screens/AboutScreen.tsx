import { useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Screen } from '@/shared/components/screens/Screen';
import { useDashboardContext } from '@/providers/DashboardProvider';
import { StaticField } from '@/shared/components/texts/StaticField';
import { ButtonContainer } from '@/shared/components/containers/ButtonContainer';
import { useDeleteVehicle } from '@/domain/vehicles';
import { AppTabsParamList, TABS } from '@/navigation/routes';
import { LinkButton } from '@/shared/components/buttons/LinkButton';
import { ConfirmModal } from '@/shared/components/modals/ConfirmModal';
import { InputGroup } from '@/shared/components/inputs/InputGroup';
import tw from '@/styles/tw';

export function AboutScreen() {
  const navigation = useNavigation<NavigationProp<AppTabsParamList>>();
  const { dashboard } = useDashboardContext();
  const vehicle = dashboard?.active?.vehicle;
  const {
    deleteVehicle,
    isLoading: isDeleting,
    error: deleteError,
  } = useDeleteVehicle();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const handleDeletePress = () => {
    setShowDeleteModal(true);
  };

  const onConfirmDelete = async () => {
    if (!vehicle?._id) {
      return;
    }
    const success = await deleteVehicle(vehicle?._id);
    if (success) {
      setShowDeleteModal(false);
      navigation.getParent()?.navigate(TABS.Dashboard);
    }
  };

  return (
    <Screen>
      <InputGroup gap={4} style={tw`mt-6`}>
        <StaticField label="Vin Number" value={vehicle?.vinNumber} />
        <StaticField label="Make" value={vehicle?.vehicleData.make} />
        <StaticField label="Model" value={vehicle?.vehicleData.model} />
        <StaticField label="Year" value={vehicle?.vehicleData.year} />
      </InputGroup>
      <ButtonContainer>
        <LinkButton
          title="Delete Vehicle"
          onPress={handleDeletePress}
          color="text-red-600"
        />
      </ButtonContainer>
      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle?"
        onConfirm={onConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Delete"
        cancelText="Cancel"
        loading={isDeleting}
        error={deleteError}
      />
    </Screen>
  );
}
