import { useEffect, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Id } from '@convex/_generated/dataModel';
import { Screen } from '@/shared/components/screens/Screen';
import { SectionHeader } from '@/shared/components/headers/SectionHeader';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';
import { DocumentGallery } from '@/shared/components/camera/DocumentGallery';
import { ControlledInput } from '@/shared/components/inputs/ControlledInput';
import { ControlledDatePicker } from '@/shared/components/inputs/ControlledDatePicker';
import { ActionGroup } from '@/shared/components/containers/ActionGroup';
import { PrimaryButton } from '@/shared/components/buttons/PrimaryButton';
import { ButtonContainer } from '@/shared/components/containers/ButtonContainer';
import { ActionMenu } from '@/shared/components/sheets/ActionMenu';
import {
  useDeleteWarranty,
  useUpdateWarranty,
  useWarranty,
} from '@/domain/warranties';
import { useWarrantyDetailsParams } from '../hooks/useWarrantyDetailsParams';
import { useEditableHeader } from '@/navigation/hooks/useEditableHeader';
import { useWarrantyChanges } from '../hooks/useWarrantyChanges';
import { usePhotoAttachment } from '@/shared/hooks/usePhotoAttachment';
import { toDateOrNull } from '@/utils/date';
import { isEmptyDate, isEmptyString } from '@/utils/format';
import tw from '@/styles/tw';
import { WARRANTIES, WarrantiesStackParamList } from '@/navigation/routes';
import { ConfirmModal } from '@/shared/components/modals/ConfirmModal';

export function WarrantiesDetailsScreen() {
  const navigation = useNavigation<NavigationProp<WarrantiesStackParamList>>();
  const { warrantyId } = useWarrantyDetailsParams();
  const warranty = useWarranty(warrantyId);

  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [removedReceiptIds, setRemovedReceiptIds] = useState<Id<'receipts'>[]>(
    [],
  );
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [manufacturer, setManufacturer] = useState<string>('');
  const [component, setComponent] = useState<string>('');

  const { openImagePicker, imageUris, removeImage } = usePhotoAttachment();
  const {
    deleteWarranty,
    isLoading: isDeleting,
    error: deleteError,
  } = useDeleteWarranty();
  const {
    updateWarranty,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateWarranty();

  const { isEditing, setIsEditing, menuVisible, setMenuVisible } =
    useEditableHeader(warranty?.warranty.component || 'Warranty', !!warranty);

  useEffect(() => {
    if (warranty && !isEditing) {
      setExpiryDate(toDateOrNull(warranty.warranty.expiresAt));
      setManufacturer(warranty.warranty.manufacturer || '');
      setComponent(warranty.warranty.component || '');
      setRemovedReceiptIds([]);
    }
  }, [warranty, isEditing]);

  const hasChanges = useWarrantyChanges(warranty, {
    expiryDate,
    manufacturer,
    component,
    removedReceiptIdsCount: removedReceiptIds.length,
    pendingImageCount: imageUris.filter((uri) => !!uri && uri.trim() !== '')
      .length,
  });

  async function handleSave() {
    const success = await updateWarranty({
      warrantyId,
      updates: {
        expiresAt: expiryDate?.getTime() || 0,
        manufacturer,
        component,
        storageIds: [],
        receiptIdsToRemove: removedReceiptIds,
      },
    });

    if (success) {
      setIsEditing(false);
      setRemovedReceiptIds([]);
    }
  }

  async function onConfirmDelete() {
    const success = await deleteWarranty(warrantyId);
    if (success) {
      setShowDeleteModal(false);
      navigation.navigate(WARRANTIES.WarrantiesList);
    }
  }

  function handleDeletePress() {
    setMenuVisible(false);
    setShowDeleteModal(true);
  }

  const isValid =
    !isEmptyString(manufacturer) &&
    !isEmptyString(component) &&
    !isEmptyDate(expiryDate);

  if (!warranty || isDeleting) {
    return <FullScreenLoading />;
  }

  return (
    <Screen>
      <SectionHeader
        title={warranty.warranty.component}
        variant="titleLg"
        style={tw`mb-4`}
      />

      <ControlledInput
        label="Manufacturer"
        value={manufacturer}
        isEditing={isEditing}
        onChangeText={setManufacturer}
        onClear={() => setManufacturer('')}
      />

      <ControlledInput
        label="Component"
        value={component}
        isEditing={isEditing}
        onChangeText={setComponent}
        onClear={() => setComponent('')}
      />

      <ControlledDatePicker
        label="Expiration Date"
        value={expiryDate}
        isEditing={isEditing}
        onDateChange={setExpiryDate}
      />
      <DocumentGallery
        existingReceipts={warranty.receipts}
        removedReceiptIds={removedReceiptIds}
        onRemoveExisting={(id) =>
          setRemovedReceiptIds((prev) =>
            prev.includes(id) ? prev : [...prev, id],
          )
        }
        pendingUris={imageUris}
        isEditing={isEditing}
        onRemovePending={removeImage}
        onAddPress={openImagePicker}
        style={isEditing ? tw`mt-8` : undefined}
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

      <ActionMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onEdit={() => setIsEditing(true)}
        onDelete={handleDeletePress}
        label="Warranty"
      />
      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Warranty"
        message="Are you sure you want to delete this warranty?"
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
