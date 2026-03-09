import { useState } from 'react';
import { Screen } from '@/shared/components/screens/Screen';
import { SectionHeader } from '@/shared/components/headers/SectionHeader';
import { Input } from '@/shared/components/inputs/Input';
import { InputGroup } from '@/shared/components/inputs/InputGroup';
import { PrimaryButton } from '@/shared/components/buttons/PrimaryButton';
import { ButtonContainer } from '@/shared/components/containers/ButtonContainer';
import { ActionGroup } from '@/shared/components/containers/ActionGroup';
import tw from '@/styles/tw';
import { RECORDS, RecordsStackParamList } from '@/navigation/routes';
import { isEmptyString } from '@/utils/format';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ControlledDatePicker } from '@/shared/components/inputs/ControlledDatePicker';
import { Id } from '@convex/_generated/dataModel';
import { DocumentGallery } from '@/shared/components/camera/DocumentGallery';
import { usePhotoAttachment } from '@/shared/hooks/usePhotoAttachment';
import { useUploadPhoto } from '@/shared/hooks/useUploadPhoto';
import { useDashboardContext } from '@/providers/DashboardProvider';
import { useCreateServiceRecord } from '@/domain/serviceRecords';
import { CategoryPicker } from '@/shared/components/inputs/CategoryPicker';
import { ScrollView } from 'react-native';
import { NumberInput } from '@/shared/components/inputs/NumberInput';
import { SERVICE_CATEGORIES, SERVICES_BY_CATEGORY } from '@/utils/const';

export function AddRecordScreen() {
  const { dashboard } = useDashboardContext();
  const vehicleId = dashboard?.active?.vehicle._id;
  const { createServiceRecord, isLoading, error } = useCreateServiceRecord();
  const [serviceDate, setServiceDate] = useState<Date | null>(null);
  const [serviceCenter, setServiceCenter] = useState<string>('');
  const navigation = useNavigation<NavigationProp<RecordsStackParamList>>();
  const [category, setCategory] = useState<string>('');
  const [services, setServices] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [cost, setCost] = useState<number>(0);
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

    const serviceRecordId = await createServiceRecord({
      vehicleId,
      serviceRecord: {
        serviceCenter,
        serviceDate: serviceDate?.getTime() || 0,
        performed: [
          {
            category,
            name,
            cost,
            notes,
            warrantyId: undefined,
            templateItemId: undefined,
          },
        ],
        storageIds: finalStorageIds,
      },
    });
    if (serviceRecordId) {
      navigation.navigate(RECORDS.RecordDetails, {
        recordId: serviceRecordId,
      });
    }
  };

  const isSubmitReady = !isEmptyString(serviceCenter) && serviceDate;

  return (
    <Screen>
      <ScrollView style={tw`flex-1 p-4`}>
        <SectionHeader title="Add Service Record" variant="titleLg" />
        <InputGroup>
          <ControlledDatePicker
            label="Service Date"
            value={serviceDate}
            onDateChange={setServiceDate}
            isEditing={true}
          />
          <Input
            label="Service Center"
            value={serviceCenter}
            onChangeText={setServiceCenter}
            onClear={() => setServiceCenter('')}
          />
          <CategoryPicker
            label="Category"
            options={SERVICE_CATEGORIES}
            selectedValue={category}
            onSelect={setCategory}
          />
          {/* TODO: Add services by category */}
          <CategoryPicker
            label="Services"
            options={SERVICES_BY_CATEGORY['oil_fluids']}
            selectedValue={services}
            onSelect={setServices}
          />
          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            onClear={() => setName('')}
          />
          <Input
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            onClear={() => setNotes('')}
          />
          <NumberInput
            label="Cost"
            value={cost}
            onChangeNumber={(value) => setCost(value)}
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
      </ScrollView>
    </Screen>
  );
}
