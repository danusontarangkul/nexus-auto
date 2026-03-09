import { useEffect, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Screen } from '@/shared/components/screens/Screen';
import { SectionHeader } from '@/shared/components/headers/SectionHeader';
import {
  useUpdateWarranty,
  useWarranty,
  useDeleteWarranty,
} from '@/domain/warranties';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';
import { useWarrantyDetailsParams } from '../hooks/useWarrantyDetailsParams';
import { useEditableHeader } from '@/navigation/hooks/useEditableHeader';
import { DocumentGallery } from '@/shared/components/camera/DocumentGallery';
import { ControlledInput } from '@/shared/components/inputs/ControlledInput';
import { ControlledDatePicker } from '@/shared/components/inputs/ControlledDatePicker';
import { toDateOrNull } from '@/utils/date';
import { ActionGroup } from '@/shared/components/containers/ActionGroup';
import { PrimaryButton } from '@/shared/components/buttons/PrimaryButton';
import { ButtonContainer } from '@/shared/components/containers/ButtonContainer';
import { Id } from '@convex/_generated/dataModel';
import { useWarrantyChanges } from '../hooks/useWarrantyChanges';
import { isEmptyDate, isEmptyString } from '@/utils/format';
import { usePhotoAttachment } from '@/shared/hooks/usePhotoAttachment';
import { ActionMenu } from '@/shared/components/sheets/ActionMenu';
import { useConfirmModal } from '@/shared/hooks/useConfirmModal';
import tw from '@/styles/tw';
import { WARRANTIES, WarrantiesStackParamList } from '@/navigation/routes';

export function WarrantiesDetailsScreen() {
  const navigation = useNavigation<NavigationProp<WarrantiesStackParamList>>();
  const { warrantyId } = useWarrantyDetailsParams();
  const warranty = useWarranty(warrantyId);

  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [removedReceiptIds, setRemovedReceiptIds] = useState<Id<'receipts'>[]>(
    [],
  );
  const [manufacturer, setManufacturer] = useState<string>('');
  const [titleOfManufacturer, setTitleOfManufacturer] = useState<string>('');

  const { openImagePicker, imageUris, removeImage } = usePhotoAttachment();
  const { showConfirm } = useConfirmModal();
  const { deleteWarranty, isLoading: isDeleting } = useDeleteWarranty();
  const {
    updateWarranty,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateWarranty();

  const { isEditing, setIsEditing, menuVisible, setMenuVisible } =
    useEditableHeader(
      warranty?.warranty.titleOfManufacturer || 'Warranty',
      !!warranty,
    );

  useEffect(() => {
    if (warranty) {
      setExpiryDate(toDateOrNull(warranty.warranty.expiresAt));
      setManufacturer(warranty.warranty.manufacturer || '');
      setTitleOfManufacturer(warranty.warranty.titleOfManufacturer || '');
    }
  }, [warranty]);

  const hasChanges = useWarrantyChanges(warranty, {
    expiryDate,
    removedReceiptIds,
    manufacturer,
    titleOfManufacturer,
    pendingUris: imageUris,
  });

  const handleSave = async () => {
    const success = await updateWarranty({
      warrantyId,
      updates: {
        expiresAt: expiryDate?.getTime() || 0,
        manufacturer,
        titleOfManufacturer,
        storageIds: [],
        receiptIdsToRemove: removedReceiptIds,
      },
    });
    if (success) {
      setIsEditing(false);
    }
  };

  const onConfirmDelete = async () => {
    const success = await deleteWarranty(warrantyId);
    if (success) {
      navigation.navigate(WARRANTIES.WarrantiesList);
    }
  };

  const handleDeletePress = () => {
    setMenuVisible(false);
    showConfirm({
      title: 'Delete Warranty',
      message:
        'Are you sure you want to remove this warranty? This action cannot be undone.',
      confirmText: 'Delete',
      onConfirm: onConfirmDelete,
    });
  };

  const isValid =
    !isEmptyString(manufacturer) &&
    !isEmptyString(titleOfManufacturer) &&
    !isEmptyDate(expiryDate);

  if (!warranty || isDeleting) {
    return <FullScreenLoading />;
  }

  return (
    <Screen>
      <SectionHeader
        title={warranty.warranty.titleOfManufacturer}
        variant="titleLg"
        style={tw`px-4`}
      />

      <DocumentGallery
        existingReceipts={warranty.receipts}
        removedReceiptIds={removedReceiptIds}
        onRemoveExisting={(id) => setRemovedReceiptIds((prev) => [...prev, id])}
        pendingUris={imageUris}
        isEditing={isEditing}
        onRemovePending={removeImage}
        onAddPress={openImagePicker}
      />

      <ControlledInput
        label="Manufacturer"
        value={manufacturer}
        isEditing={isEditing}
        onChangeText={setManufacturer}
      />

      <ControlledInput
        label="Title"
        value={titleOfManufacturer}
        isEditing={isEditing}
        onChangeText={setTitleOfManufacturer}
      />

      <ControlledDatePicker
        label="Expiration Date"
        value={expiryDate}
        isEditing={isEditing}
        onDateChange={setExpiryDate}
      />

      {isEditing && (
        <ButtonContainer>
          <ActionGroup error={updateError}>
            <PrimaryButton
              title="Save Changes"
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
    </Screen>
  );
}
