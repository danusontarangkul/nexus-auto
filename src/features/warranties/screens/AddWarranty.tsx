import { useState } from 'react';
import { Screen } from '@/shared/components/screens/Screen';
import { SectionHeader } from '@/shared/components/headers/SectionHeader';
import { useCreateWarranty } from '@/domain/warranties';
import { Input } from '@/shared/components/inputs/Input';
import { InputGroup } from '@/shared/components/inputs/InputGroup';
import { PrimaryButton } from '@/shared/components/buttons/PrimaryButton';
import { ButtonContainer } from '@/shared/components/containers/ButtonContainer';
import { ActionGroup } from '@/shared/components/containers/ActionGroup';
import tw from '@/styles/tw';
import { WARRANTIES, WarrantiesStackParamList } from '@/navigation/routes';
import { isEmptyString } from '@/utils/format';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ControlledDatePicker } from '@/shared/components/inputs/ControlledDatePicker';
import { Id } from '@convex/_generated/dataModel';
import { DocumentGallery } from '@/shared/components/camera/DocumentGallery';
import { usePhotoAttachment } from '@/shared/hooks/usePhotoAttachment';
import { useUploadPhoto } from '@/shared/hooks/useUploadPhoto';
import { useDashboardContext } from '@/providers/DashboardProvider';
import { ImageSourcePickerSheet } from '@/shared/components/sheets/ImageSourcePickerSheet';

export function AddWarrantyScreen() {
  const { dashboard } = useDashboardContext();
  const vehicleId = dashboard?.active?.vehicle._id;
  const { createWarranty, isLoading, error } = useCreateWarranty();
  const [manufacturer, setManufacturer] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [component, setComponent] = useState<string>('');
  const navigation = useNavigation<NavigationProp<WarrantiesStackParamList>>();

  const {
    uploadImages,
    isLoading: isUploading,
    error: uploadError,
  } = useUploadPhoto();

  const {
    imageUris,
    removeImage,
    openImagePicker,
    isImageSourceSheetOpen,
    closeImageSourceSheet,
    selectImageSource,
  } = usePhotoAttachment();

  const handleSubmit = async () => {
    if (!vehicleId) {
      return;
    }
    let finalStorageIds: Id<'_storage'>[] = [];
    if (imageUris.length > 0) {
      finalStorageIds = await uploadImages(imageUris);
    }

    const warrantyId = await createWarranty({
      vehicleId,
      expiresAt: expirationDate?.getTime() || 0,
      manufacturer,
      component,
      storageIds: finalStorageIds,
    });
    if (warrantyId) {
      navigation.navigate(WARRANTIES.WarrantiesList);
    }
  };

  const isSubmitReady =
    !isEmptyString(component) && !isEmptyString(manufacturer) && expirationDate;

  return (
    <Screen>
      <SectionHeader title="Add Warranty" variant="titleLg" />
      <InputGroup>
        <Input
          label="Component"
          placeholder="e.g. Engine, Brake Pads, etc."
          value={component}
          onChangeText={setComponent}
          onClear={() => setComponent('')}
        />
        <Input
          label="Manufacturer"
          placeholder="e.g. Goodyear, Honda, etc."
          value={manufacturer}
          onChangeText={setManufacturer}
          onClear={() => setManufacturer('')}
        />
        <ControlledDatePicker
          label="Expiration Date"
          value={expirationDate}
          onDateChange={setExpirationDate}
          isEditing={true}
        />

        <DocumentGallery
          existingReceipts={[]}
          removedReceiptIds={[]}
          onRemoveExisting={() => {}}
          pendingUris={imageUris}
          isEditing={true}
          onRemovePending={removeImage}
          onAddPress={openImagePicker}
          style={tw`mt-4`}
        />
      </InputGroup>
      <ButtonContainer>
        <ActionGroup error={error || uploadError}>
          <PrimaryButton
            title="Submit"
            style={tw`rounded-xl py-4`}
            onPress={handleSubmit}
            disabled={!isSubmitReady}
            isLoading={isLoading || isUploading}
          />
        </ActionGroup>
      </ButtonContainer>

      <ImageSourcePickerSheet
        visible={isImageSourceSheetOpen}
        onClose={closeImageSourceSheet}
        onSelectCamera={() => selectImageSource('camera')}
        onSelectLibrary={() => selectImageSource('library')}
      />
    </Screen>
  );
}
