import { useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { BackHeader } from '@/navigation/components/BackHeader';
import { Screen } from '@/shared/components/screens/Screen';
import { useDashboardContext } from '@/providers/DashboardProvider';
import { StaticField } from '@/shared/components/texts/StaticField';
import tw from '@/styles/tw';
import { ButtonContainer } from '@/shared/components/containers/ButtonContainer';
import { useDeleteVehicle } from '@/domain/vehicles';
import { AppTabsParamList, TABS } from '@/navigation/routes';
import { LinkButton } from '@/shared/components/buttons/LinkButton';
import { SectionHeader } from '@/shared/components/headers/SectionHeader';
import { ConfirmModal } from '@/shared/components/modals/ConfirmModal';
import { InputGroup } from '@/shared/components/inputs/InputGroup';

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
      navigation.navigate(TABS.Dashboard);
    }
  };

  return (
    <Screen>
      <View style={tw` mt-6`}>
        <SectionHeader
          title="About"
          variant="titleLg"
          style={tw`mb-4 text-center w-full`}
        />
        <InputGroup gap={4}>
          <StaticField label="Vin Number" value={vehicle?.vinNumber} />
          <StaticField label="Make" value={vehicle?.vehicleData.make} />
          <StaticField label="Model" value={vehicle?.vehicleData.model} />
          <StaticField label="Year" value={vehicle?.vehicleData.year} />
        </InputGroup>
      </View>
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
