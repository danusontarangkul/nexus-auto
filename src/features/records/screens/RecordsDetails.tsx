import { useEffect, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Id } from '@convex/_generated/dataModel';
import { Screen } from '@/shared/components/screens/Screen';
import { SectionHeader } from '@/shared/components/headers/SectionHeader';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';
import { useEditableHeader } from '@/navigation/hooks/useEditableHeader';
import { ActionGroup } from '@/shared/components/containers/ActionGroup';
import { PrimaryButton } from '@/shared/components/buttons/PrimaryButton';
import { ButtonContainer } from '@/shared/components/containers/ButtonContainer';
import { usePhotoAttachment } from '@/shared/hooks/usePhotoAttachment';
import { useRecordsRouteParams } from '../hooks/useRecordRouteParams';
import {
  useServiceRecord,
  useUpdateServiceRecord,
  useDeleteServiceRecord,
} from '@/domain/serviceRecords';
import { ActionMenu } from '@/shared/components/sheets/ActionMenu';
import { RecordsStackParamList } from '@/navigation/routes';
import { navigateToRecordsListScreen } from '@/navigation/navigateToRecordsList';
import { useHardwareBackToRecordsList } from '@/navigation/hooks/useHardwareBackToRecordsList';
import { ControlledDatePicker } from '@/shared/components/inputs/ControlledDatePicker';
import { ControlledInput } from '@/shared/components/inputs/ControlledInput';
import { DocumentGallery } from '@/shared/components/camera/DocumentGallery';
import { InputGroup } from '@/shared/components/inputs/InputGroup';
import { ScrollContainer } from '@/shared/components/containers/ScrollContainer';
import { toDateOrNull } from '@/utils/date';
import { isEmptyString } from '@/utils/format';
import { ConfirmModal } from '@/shared/components/modals/ConfirmModal';
import tw from '@/styles/tw';
import { PerformedService } from '@convex/types';
import { DashedButton } from '@/shared/components/buttons/DashedButton';
import { ServiceItemCard } from '../components/ServiceItemCard';
import { View } from 'react-native';
import { ControlledNumberInput } from '@/shared/components/inputs/ControlledNumberInput';
import { useDashboardContext } from '@/providers/DashboardProvider';
import { ServiceCategoryType } from '@convex/types/literals';
import {
  getDefaultRoutinePerformedService,
  getServiceOptionsForCategory,
} from '../utils/utils';
import { ImageSourcePickerSheet } from '@/shared/components/sheets/ImageSourcePickerSheet';

export function RecordsDetailsScreen() {
  const navigation = useNavigation<NavigationProp<RecordsStackParamList>>();
  useHardwareBackToRecordsList(navigation);

  const { recordId } = useRecordsRouteParams();
  const { dashboard } = useDashboardContext();
  const maintenanceItems = dashboard?.active?.maintenanceItems;

  const serviceRecord = useServiceRecord(recordId);

  const getOptionsForCategory = (category: ServiceCategoryType) => {
    return getServiceOptionsForCategory(maintenanceItems, category);
  };

  const [serviceDate, setServiceDate] = useState<Date | null>(null);
  const [serviceCenter, setServiceCenter] = useState<string>('');

  const [performedServices, setPerformedServices] = useState<
    PerformedService[]
  >([]);

  const [removedReceiptIds, setRemovedReceiptIds] = useState<Id<'receipts'>[]>(
    [],
  );

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [mileage, setMileage] = useState<number>(0);

  const [storageIds] = useState<Id<'_storage'>[]>([]);

  const {
    openImagePicker,
    imageUris,
    removeImage,
    isImageSourceSheetOpen,
    closeImageSourceSheet,
    selectImageSource,
  } = usePhotoAttachment();

  const {
    deleteServiceRecord,
    isLoading: isDeleting,
    error: deleteError,
  } = useDeleteServiceRecord();

  const {
    updateServiceRecord,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateServiceRecord();

  const { isEditing, setIsEditing, menuVisible, setMenuVisible } =
    useEditableHeader(
      serviceRecord?.serviceRecord.serviceCenter || 'Service Record',
      !!serviceRecord,
    );

  useEffect(() => {
    if (serviceRecord) {
      setServiceDate(toDateOrNull(serviceRecord.serviceRecord.serviceDate));

      setServiceCenter(serviceRecord.serviceRecord.serviceCenter || '');
      setMileage(serviceRecord.serviceRecord.mileage);

      setPerformedServices(
        serviceRecord.serviceRecord.performed.map((performed) => ({
          category: performed.category,
          serviceName: performed.serviceName,
          notes: performed.notes || '',
          maintenanceItemId: performed.maintenanceItemId || undefined,
          warrantyId: performed.warrantyId || undefined,
        })),
      );
    }
  }, [serviceRecord]);

  const handleUpdateService = (
    index: number,
    updates: Partial<PerformedService>,
  ) => {
    setPerformedServices((prev) =>
      prev.map((service, i) =>
        i === index ? { ...service, ...updates } : service,
      ),
    );
  };

  const addServiceItem = () => {
    setPerformedServices((prev) => [
      ...prev,
      getDefaultRoutinePerformedService(maintenanceItems),
    ]);
  };

  const removeServiceItem = (index: number) => {
    setPerformedServices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!serviceRecord) {
      return;
    }

    const success = await updateServiceRecord({
      serviceRecordId: recordId,
      updates: {
        performed: performedServices.map((service) => ({
          ...service,
          notes: service.notes || '',
          maintenanceItemId: service.maintenanceItemId || undefined,
          warrantyId: service.warrantyId || undefined,
        })),
        mileage,
        serviceDate: serviceDate?.getTime() || 0,
        storageIds,
        receiptIdsToRemove: removedReceiptIds,
        serviceCenter,
      },
    });

    if (success) {
      setIsEditing(false);
    }
  };

  const handleConfirmDelete = async () => {
    const success = await deleteServiceRecord(recordId);

    if (success) {
      setShowDeleteModal(false);
      navigateToRecordsListScreen(navigation);
    }
  };

  if (!serviceRecord) {
    return <FullScreenLoading />;
  }

  const isValid =
    !isEmptyString(serviceCenter) &&
    serviceDate &&
    performedServices.length > 0;

  return (
    <Screen>
      <ScrollContainer>
        <SectionHeader
          title="Record Details"
          variant="titleLg"
          style={tw`mb-4`}
        />

        <InputGroup gap={4}>
          <ControlledDatePicker
            label="Service Date"
            value={serviceDate}
            onDateChange={setServiceDate}
            isEditing={isEditing}
          />

          <ControlledInput
            label="Service Center"
            value={serviceCenter}
            onChangeText={setServiceCenter}
            isEditing={isEditing}
          />
          <ControlledNumberInput
            label="Mileage"
            value={mileage}
            onChangeNumber={setMileage}
            isEditing={isEditing}
          />

          <DocumentGallery
            existingReceipts={serviceRecord.receipts}
            removedReceiptIds={removedReceiptIds}
            onRemoveExisting={(id) =>
              setRemovedReceiptIds((prev) => [...prev, id])
            }
            pendingUris={imageUris}
            isEditing={isEditing}
            onRemovePending={removeImage}
            onAddPress={openImagePicker}
          />

          <View style={tw`mt-4`}>
            {performedServices.map((service, index) => (
              <ServiceItemCard
                key={index}
                index={index}
                service={service}
                isEditing={isEditing}
                onUpdate={(updates) => handleUpdateService(index, updates)}
                onRemove={
                  isEditing && performedServices.length > 1
                    ? () => removeServiceItem(index)
                    : undefined
                }
                specificServiceOptions={getOptionsForCategory(service.category)}
                maintenanceItems={maintenanceItems}
              />
            ))}

            {isEditing && (
              <DashedButton
                title="+ Add Another Service"
                onPress={addServiceItem}
                style={tw`mt-2`}
              />
            )}
          </View>
        </InputGroup>

        {isEditing && (
          <ButtonContainer>
            <ActionGroup error={updateError}>
              <PrimaryButton
                title="Save Changes"
                onPress={handleSave}
                isLoading={isUpdating}
                disabled={!isValid}
              />
            </ActionGroup>
          </ButtonContainer>
        )}
      </ScrollContainer>

      <ActionMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onEdit={() => setIsEditing(true)}
        onDelete={() => {
          setShowDeleteModal(true);
          setMenuVisible(false);
        }}
        label="Record"
      />

      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Record"
        message="Are you sure? This will also remove associated receipts."
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Delete"
        cancelText="Cancel"
        loading={isDeleting}
        error={deleteError}
      />

      <ImageSourcePickerSheet
        visible={isImageSourceSheetOpen}
        onClose={closeImageSourceSheet}
        onSelectCamera={() => selectImageSource('camera')}
        onSelectLibrary={() => selectImageSource('library')}
      />
    </Screen>
  );
}
