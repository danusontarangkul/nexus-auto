import { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Id } from '@convex/_generated/dataModel';
import { Screen } from '@/shared/components/screens/Screen';
import { useRegistration, useUpsertRegistration } from '@/domain/registrations';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';
import { useRegistrationRouteParams } from '../hooks/useRegistrationRouteParams';
import { ControlledDatePicker } from '@/shared/components/inputs/ControlledDatePicker';
import { ScannerCamera } from '@/shared/components/camera/ScannerCamera';
import { usePhotoAttachment } from '@/shared/hooks/usePhotoAttachment';
import { useUploadPhoto } from '@/shared/hooks/useUploadPhoto';
import { toDateOrNull } from '@/utils/date';
import { ButtonContainer } from '@/shared/components/containers/ButtonContainer';
import { ActionGroup } from '@/shared/components/containers/ActionGroup';
import { PrimaryButton } from '@/shared/components/buttons/PrimaryButton';
import tw from '@/styles/tw';
import { DocumentGallery } from '@/shared/components/camera/DocumentGallery';
import { useRegistrationChanges } from '../hooks/useRegistrationChanges';
import { EmptyState } from '@/shared/components/texts/EmptyState';
import { useEditHeader } from '@/navigation/hooks/useEditHeader';
import { ImageSourcePickerSheet } from '@/shared/components/sheets/ImageSourcePickerSheet';

export function RegistrationScreen() {
  const { vehicleId } = useRegistrationRouteParams();
  const registrationData = useRegistration(vehicleId);

  const registration = registrationData?.registration;
  const existingReceipts = registrationData?.receipts || [];

  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [removedReceiptIds, setRemovedReceiptIds] = useState<Id<'receipts'>[]>(
    [],
  );

  const {
    upsertRegistration,
    isLoading: isSaving,
    error: saveError,
  } = useUpsertRegistration();

  const { isEditing, setIsEditing } = useEditHeader(
    'Registration',
    !!registration,
  );
  const { uploadImages, isLoading: isUploading } = useUploadPhoto();

  const {
    isTakingPhoto,
    imageUris,
    setImageUris,
    removeImage,
    addCapturedPhoto,
    openImagePicker,
    isImageSourceSheetOpen,
    closeImageSourceSheet,
    selectImageSource,
  } = usePhotoAttachment({ useScannerCamera: true });

  const hasChanges = useRegistrationChanges(registration, {
    expiryDate,
    removedReceiptIds,
    imageUris,
  });

  useEffect(() => {
    setExpiryDate(toDateOrNull(registration?.expiresAt));
    setRemovedReceiptIds([]);
    setImageUris([]);
  }, [registration, isEditing, setImageUris]);

  const handleSave = async () => {
    if (!expiryDate) {
      return;
    }

    const validStorageIds = await uploadImages(imageUris);

    const success = await upsertRegistration({
      vehicleId,
      expiresAt: expiryDate.getTime(),
      newReceiptStorageIds: validStorageIds,
      receiptIdsToRemove: removedReceiptIds,
    });

    if (success) {
      setIsEditing(false);
      setImageUris([]);
      setRemovedReceiptIds([]);
    }
  };

  if (!registrationData) {
    return <FullScreenLoading />;
  }

  if (isTakingPhoto) {
    return (
      <ScannerCamera
        onCapture={async (uri) => {
          addCapturedPhoto(uri);
        }}
        instructionText="Photo of Registration"
      />
    );
  }

  return (
    <Screen>
      <ScrollView style={tw`flex-1 p-4`}>
        {registration || isEditing ? (
          <View>
            <ControlledDatePicker
              label="Registration Expiration"
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
            title="No registration records."
            description="Tap the plus icon in the header to add."
          />
        )}
      </ScrollView>

      {isEditing && (
        <ButtonContainer>
          <ActionGroup error={saveError}>
            <PrimaryButton
              title="Save"
              onPress={handleSave}
              isLoading={isSaving || isUploading}
              disabled={!expiryDate || !hasChanges}
            />
          </ActionGroup>
        </ButtonContainer>
      )}

      <ImageSourcePickerSheet
        visible={isImageSourceSheetOpen}
        onClose={closeImageSourceSheet}
        onSelectCamera={() => selectImageSource('camera')}
        onSelectLibrary={() => selectImageSource('library')}
      />
    </Screen>
  );
}
