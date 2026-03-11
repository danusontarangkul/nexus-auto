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

export function AddWarrantyScreen() {
  const { dashboard } = useDashboardContext();
  const vehicleId = dashboard?.active?.vehicle._id;
  const { createWarranty, isLoading, error } = useCreateWarranty();
  const [manufacturer, setManufacturer] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [titleOfManufacturer, setTitleOfManufacturer] = useState<string>('');
  const navigation = useNavigation<NavigationProp<WarrantiesStackParamList>>();

  const {
    uploadImages,
    isLoading: isUploading,
    error: uploadError,
  } = useUploadPhoto();

  const { imageUris, removeImage, openImagePicker } = usePhotoAttachment();

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
      titleOfManufacturer,
      storageIds: finalStorageIds,
    });
    if (warrantyId) {
      navigation.navigate(WARRANTIES.WarrantiesList);
    }
  };

  const isSubmitReady =
    !isEmptyString(titleOfManufacturer) &&
    !isEmptyString(manufacturer) &&
    expirationDate;

  return (
    <Screen>
      <SectionHeader title="Add Warranty" variant="titleLg" />
      <InputGroup>
        <Input
          label="Title of Manufacturer"
          placeholder="Title of Manufacturer"
          value={titleOfManufacturer}
          onChangeText={setTitleOfManufacturer}
          onClear={() => setTitleOfManufacturer('')}
        />
        <Input
          label="Manufacturer"
          placeholder="Manufacturer"
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
    </Screen>
  );
}
