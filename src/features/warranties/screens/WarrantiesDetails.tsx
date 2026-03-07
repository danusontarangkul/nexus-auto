import React, { useEffect, useState } from 'react';
import { Screen } from '@/shared/components/Screen';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { useUpdateWarranty, useWarranty } from '@/domain/warranties';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';
import { useWarrantyDetailsParams } from '../hooks/useWarrantyDetailsParams';
import { useEditableHeader } from '@/navigation/hooks/useEditableHeader';
import { DocumentGallery } from '@/shared/components/camera/DocumentGallery';
import { ControlledInput } from '@/shared/components/inputs/ControlledInput';
import { ControlledDatePicker } from '@/shared/components/inputs/ControlledDatePicker';
import { toDateOrNull } from '@/utils/date';
import { ActionGroup } from '@/shared/components/ActionGroup';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { ButtonContainer } from '@/shared/components/ButtonContainer';
import { Id } from '@convex/_generated/dataModel';
import { useWarrantyChanges } from '../hooks/useWarrantyChanges';
import { isEmptyDate, isEmptyString } from '@/utils/format';
import { usePhotoAttachment } from '@/shared/hooks/usePhotoAttachment';

export function WarrantiesDetailsScreen() {
  const { warrantyId } = useWarrantyDetailsParams();
  const warranty = useWarranty(warrantyId);

  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [removedReceiptIds, setRemovedReceiptIds] = useState<Id<'receipts'>[]>(
    [],
  );
  const [manufacturer, setManufacturer] = useState<string>('');
  const [titleOfManufacturer, setTitleOfManufacturer] = useState<string>('');

  const { openImagePicker, imageUris, removeImage } = usePhotoAttachment();

  useEffect(() => {
    setExpiryDate(toDateOrNull(warranty?.warranty.expiresAt));
    setManufacturer(warranty?.warranty.manufacturer || '');
    setTitleOfManufacturer(warranty?.warranty.titleOfManufacturer || '');
  }, [warranty]);

  const hasChanges = useWarrantyChanges(warranty, {
    expiryDate,
    removedReceiptIds,
    manufacturer,
    titleOfManufacturer,
    pendingUris: imageUris,
  });

  const { updateWarranty, isLoading, error } = useUpdateWarranty();

  const { isEditing, setIsEditing } = useEditableHeader(
    warranty?.warranty.titleOfManufacturer || '',
    !!warranty,
  );

  const handleSave = async () => {
    const success = await updateWarranty({
      warrantyId,
      updates: {
        expiresAt: warranty?.warranty.expiresAt || 0,
        manufacturer: warranty?.warranty.manufacturer || '',
        titleOfManufacturer: warranty?.warranty.titleOfManufacturer || '',
        storageIds: warranty?.receipts.map((receipt) => receipt.storageId),
        receiptIdsToRemove: [],
      },
    });
    if (success) {
      setIsEditing(false);
    }
  };

  const isValid =
    !isEmptyString(manufacturer) &&
    !isEmptyString(titleOfManufacturer) &&
    !isEmptyDate(expiryDate);

  if (!warranty) {
    return <FullScreenLoading />;
  }

  return (
    <Screen>
      <SectionHeader
        title={warranty.warranty.titleOfManufacturer}
        variant="titleLg"
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
        label="Title of Manufacturer"
        value={titleOfManufacturer}
        isEditing={isEditing}
        onChangeText={setManufacturer}
      />
      <ControlledDatePicker
        label="Expiration Date"
        value={expiryDate}
        isEditing={isEditing}
        onDateChange={setExpiryDate}
      />
      {isEditing && (
        <ButtonContainer>
          <ActionGroup error={error}>
            <PrimaryButton
              title="Save"
              onPress={handleSave}
              isLoading={isLoading}
              disabled={!hasChanges || !isValid}
            />
          </ActionGroup>
        </ButtonContainer>
      )}
    </Screen>
  );
}
