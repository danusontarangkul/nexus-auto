import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Id } from '@convex/_generated/dataModel';
import { Screen } from '@/shared/components/Screen';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';
import { ControlledDatePicker } from '@/shared/components/inputs/ControlledDatePicker';
import { ScannerCamera } from '@/shared/components/camera/ScannerCamera';
import { usePhotoAttachment } from '@/shared/hooks/usePhotoAttachment';
import { useUploadPhoto } from '@/shared/hooks/useUploadPhoto';
import { toDateOrNull } from '@/utils/date';
import { ButtonContainer } from '@/shared/components/ButtonContainer';
import { ActionGroup } from '@/shared/components/ActionGroup';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import tw from '@/styles/tw';
import { DocumentGallery } from '@/shared/components/camera/DocumentGallery';
import { EmptyState } from '@/shared/components/texts/EmptyState';
import { useInsurance } from '@/domain/insurance/useInsurance';
import { useUpsertInsurance } from '@/domain/insurance/useUpsertInsurance';
import { useInsuranceRouteParams } from '../hooks/useInsuranceRouteParams';
import { useEditableHeader } from '@/navigation/hooks/useEditableHeader';
import { useInsuranceChanges } from '../hooks/useInsuranceChanges';
import { ControlledInput } from '@/shared/components/inputs/ControlledInput';
import { isEmptyString } from '@/utils/format';

export function InsuranceScreen() {
  const { vehicleId } = useInsuranceRouteParams();
  const insuranceData = useInsurance(vehicleId);

  const insurance = insuranceData?.insurance;
  const existingReceipts = insuranceData?.receipts || [];

  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [removedReceiptIds, setRemovedReceiptIds] = useState<Id<'receipts'>[]>(
    [],
  );
  const [providerName, setProviderName] = useState<string>('');
  const {
    upsertInsurance,
    isLoading: isSaving,
    error: saveError,
  } = useUpsertInsurance();

  const { isEditing, setIsEditing } = useEditableHeader(
    'Insurance',
    !!insurance,
  );
  const {
    uploadImages,
    isLoading: isUploading,
    error: uploadError,
  } = useUploadPhoto();

  const {
    isTakingPhoto,
    imageUris,
    setImageUris,
    removeImage,
    addCapturedPhoto,
    openImagePicker,
  } = usePhotoAttachment();

  const hasChanges = useInsuranceChanges(insurance, {
    expiryDate,
    removedReceiptIds,
    imageUris,
    providerName,
  });

  useEffect(() => {
    setExpiryDate(toDateOrNull(insurance?.expiresAt));
    setRemovedReceiptIds([]);
    setImageUris([]);
    setProviderName(insurance?.providerName || '');
  }, [insurance, isEditing, setImageUris]);

  const handleSave = async () => {
    if (!expiryDate || isEmptyString(providerName)) {
      return;
    }

    const validStorageIds = await uploadImages(imageUris);

    const success = await upsertInsurance({
      vehicleId,
      expiresAt: expiryDate.getTime(),
      newReceiptStorageIds: validStorageIds,
      receiptIdsToRemove: removedReceiptIds,
      providerName,
    });

    if (success) {
      setIsEditing(false);
      setImageUris([]);
      setRemovedReceiptIds([]);
      setProviderName('');
      setExpiryDate(null);
    }
  };

  const isDisabled = !expiryDate || isEmptyString(providerName) || !hasChanges;

  if (!insuranceData) {
    return <FullScreenLoading />;
  }

  if (isTakingPhoto) {
    return (
      <ScannerCamera
        onCapture={async (uri) => {
          addCapturedPhoto(uri);
        }}
        instructionText="Photo of Insurance"
      />
    );
  }

  return (
    <Screen>
      <ScrollView style={tw`flex-1 p-4`}>
        {insurance || isEditing ? (
          <View>
            <ControlledInput
              label="Insurance Provider"
              value={providerName}
              isEditing={isEditing}
              onChangeText={setProviderName}
              placeholder="e.g. State Farm"
              autoCapitalize="words"
            />
            <ControlledDatePicker
              label="Insurance Expiration"
              value={expiryDate}
              isEditing={isEditing}
              onDateChange={setExpiryDate}
            />

            <DocumentGallery
              existingReceipts={existingReceipts}
              removedReceiptIds={removedReceiptIds}
              pendingUris={imageUris}
              isEditing={isEditing}
              onRemoveExisting={(id) =>
                setRemovedReceiptIds((prev) => [...prev, id])
              }
              onRemovePending={removeImage}
              onAddPress={openImagePicker}
            />
          </View>
        ) : (
          <EmptyState
            title="No insurance records."
            description="Tap the plus icon in the header to add."
          />
        )}
      </ScrollView>

      {isEditing && (
        <ButtonContainer>
          <ActionGroup error={saveError || uploadError}>
            <PrimaryButton
              title="Save Changes"
              onPress={handleSave}
              isLoading={isSaving || isUploading}
              disabled={isDisabled}
            />
          </ActionGroup>
        </ButtonContainer>
      )}
    </Screen>
  );
}
