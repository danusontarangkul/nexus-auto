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
import { useServiceRecordChanges } from '../hooks/useRecordChanges';
import {
  useServiceRecord,
  useUpdateServiceRecord,
  useDeleteServiceRecord,
} from '@/domain/serviceRecords';
import { ActionMenu } from '@/shared/components/sheets/ActionMenu';
import { useConfirmModal } from '@/shared/hooks/useConfirmModal';
import { RECORDS, RecordsStackParamList } from '@/navigation/routes';
import { ControlledDatePicker } from '@/shared/components/inputs/ControlledDatePicker';
import { ControlledInput } from '@/shared/components/inputs/ControlledInput';
import { SERVICE_CATEGORIES, SERVICES_BY_CATEGORY } from '@/utils/const';
import { ControlledCategoryPicker } from '@/shared/components/inputs/ControlledCategoryPicker';
import { ControlledNumberInput } from '@/shared/components/inputs/ControlledNumberInput';
import { DocumentGallery } from '@/shared/components/camera/DocumentGallery';
import { InputGroup } from '@/shared/components/inputs/InputGroup';
import { ScrollContainer } from '@/shared/components/containers/ScrollContainer';
import { toDateOrNull } from '@/utils/date';
import { isEmptyString } from '@/utils/format';

export function RecordsDetailsScreen() {
  const navigation = useNavigation<NavigationProp<RecordsStackParamList>>();
  const { recordId } = useRecordsRouteParams();
  const serviceRecord = useServiceRecord(recordId);
  const [serviceDate, setServiceDate] = useState<Date | null>(null);
  const [serviceCenter, setServiceCenter] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [services, setServices] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [cost, setCost] = useState<number>(0);
  const [removedReceiptIds, setRemovedReceiptIds] = useState<Id<'receipts'>[]>(
    [],
  );
  const [storageIds, setStorageIds] = useState<Id<'_storage'>[]>([]);
  const [pendingUris, setPendingUris] = useState<string[]>([]);
  const { openImagePicker, imageUris, removeImage } = usePhotoAttachment();
  const { showConfirm } = useConfirmModal();
  const { deleteServiceRecord, isLoading: isDeleting } =
    useDeleteServiceRecord();
  const {
    updateServiceRecord,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateServiceRecord();

  const { isEditing, setIsEditing, menuVisible, setMenuVisible } =
    useEditableHeader(
      serviceRecord?.serviceRecord.performed[0].name || '',
      !!serviceRecord,
    );

  useEffect(() => {
    setServiceDate(toDateOrNull(serviceRecord?.serviceRecord.serviceDate));
    setServiceCenter(serviceRecord?.serviceRecord.serviceCenter || '');
    setCategory(serviceRecord?.serviceRecord.performed[0].category || '');
    setName(serviceRecord?.serviceRecord.performed[0].name || '');
    setNotes(serviceRecord?.serviceRecord.performed[0].notes || '');
    setCost(serviceRecord?.serviceRecord.performed[0].cost || 0);
    setServices(serviceRecord?.serviceRecord.performed[0].templateItemId || '');
  }, [serviceRecord]);

  const hasChanges = useServiceRecordChanges(serviceRecord, {
    serviceDate,
    serviceCenter,
    category,
    services,
    name,
    notes,
    cost,
  });

  const isValid = !isEmptyString(serviceCenter) && serviceDate;

  const handleSave = async () => {
    if (!serviceRecord) {
      return;
    }
    const existing = serviceRecord.serviceRecord.performed[0];
    const success = await updateServiceRecord({
      serviceRecordId: recordId,
      updates: {
        performed: [
          {
            ...existing,
            category,
            name,
            notes,
            cost,
            templateItemId: services
              ? (services as Id<'maintenanceItems'>)
              : undefined,
            warrantyId: existing.warrantyId ?? undefined,
          },
        ],
        serviceDate: serviceDate?.getTime() || 0,
        storageIds: storageIds,
        receiptIdsToRemove: removedReceiptIds,
        serviceCenter: serviceCenter,
      },
    });
    if (success) {
      setIsEditing(false);
    }
  };

  const onConfirmDelete = async () => {
    const success = await deleteServiceRecord(recordId);
    if (success) {
      navigation.navigate(RECORDS.RecordsList);
    }
  };

  const handleDeletePress = () => {
    setMenuVisible(false);
    showConfirm({
      title: 'Delete Record',
      message:
        'Are you sure you want to remove this service record? This action cannot be undone.',
      confirmText: 'Delete',
      onConfirm: onConfirmDelete,
    });
  };

  if (!serviceRecord || isDeleting) {
    return <FullScreenLoading />;
  }

  return (
    <Screen>
      <ScrollContainer>
        <SectionHeader
          title={serviceRecord.serviceRecord.performed[0].name}
          variant="titleLg"
        />
        <InputGroup>
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
          <ControlledCategoryPicker
            label="Category"
            value={category}
            options={SERVICE_CATEGORIES}
            onSelect={setCategory}
            isEditing={isEditing}
          />
          <ControlledCategoryPicker
            label="Services"
            value={services}
            options={SERVICES_BY_CATEGORY['oil_fluids']}
            onSelect={setServices}
            isEditing={isEditing}
          />
          <ControlledInput
            label="Name"
            value={name}
            onChangeText={setName}
            isEditing={isEditing}
          />
          <ControlledInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            isEditing={isEditing}
          />
          <ControlledNumberInput
            label="Cost"
            value={cost}
            onChangeNumber={setCost}
            isEditing={isEditing}
          />
        </InputGroup>
        <DocumentGallery
          existingReceipts={serviceRecord.receipts}
          removedReceiptIds={removedReceiptIds}
          onRemoveExisting={(id) =>
            setRemovedReceiptIds((prev: Id<'receipts'>[]) => [...prev, id])
          }
          pendingUris={imageUris}
          isEditing={isEditing}
          onRemovePending={removeImage}
          onAddPress={openImagePicker}
        />

        {isEditing && (
          <ButtonContainer>
            <ActionGroup error={updateError}>
              <PrimaryButton
                title="Save"
                onPress={handleSave}
                isLoading={isUpdating}
                disabled={!hasChanges || !isValid}
              />
            </ActionGroup>
          </ButtonContainer>
        )}
      </ScrollContainer>

      <ActionMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onEdit={() => setIsEditing(true)}
        onDelete={handleDeletePress}
        label="Record"
      />
    </Screen>
  );
}
