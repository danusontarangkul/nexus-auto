import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Id } from '@convex/_generated/dataModel';
import { Screen } from '@/shared/components/screens/Screen';
import { SectionHeader } from '@/shared/components/headers/SectionHeader';
import { Input } from '@/shared/components/inputs/Input';
import { InputGroup } from '@/shared/components/inputs/InputGroup';
import { PrimaryButton } from '@/shared/components/buttons/PrimaryButton';
import { ButtonContainer } from '@/shared/components/containers/ButtonContainer';
import { ActionGroup } from '@/shared/components/containers/ActionGroup';
import { ControlledDatePicker } from '@/shared/components/inputs/ControlledDatePicker';
import { DocumentGallery } from '@/shared/components/camera/DocumentGallery';
import { DashedButton } from '@/shared/components/buttons/DashedButton';
import { usePhotoAttachment } from '@/shared/hooks/usePhotoAttachment';
import { useUploadPhoto } from '@/shared/hooks/useUploadPhoto';
import { useDashboardContext } from '@/providers/DashboardProvider';
import { useCreateServiceRecord } from '@/domain/serviceRecords';
import { RECORDS, RecordsStackParamList } from '@/navigation/routes';
import { isEmptyString } from '@/utils/format';
import { ServiceCategoryType } from '@convex/types/literals';
import { PerformedService } from '@convex/types';
import tw from '@/styles/tw';
import { ServiceItemCard } from '../components/ServiceItemCard';

export function AddRecordScreen() {
  const navigation = useNavigation<NavigationProp<RecordsStackParamList>>();

  const { dashboard } = useDashboardContext();

  const vehicleId = dashboard?.active?.vehicle._id;

  const { createServiceRecord, isLoading, error } = useCreateServiceRecord();

  const {
    uploadImages,
    isLoading: isUploading,
    error: uploadError,
  } = useUploadPhoto();

  const { imageUris, removeImage, openImagePicker } = usePhotoAttachment();

  const [serviceDate, setServiceDate] = useState<Date | null>(new Date());

  const [serviceCenter, setServiceCenter] = useState('');

  const [performedServices, setPerformedServices] = useState<
    PerformedService[]
  >([{ category: 'routine', serviceName: '', notes: '' }]);

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
      { category: 'routine', serviceName: '', notes: '' },
    ]);
  };

  const removeServiceItem = (index: number) => {
    setPerformedServices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!vehicleId) return;

    let finalStorageIds: Id<'_storage'>[] = [];

    if (imageUris.length > 0) {
      finalStorageIds = await uploadImages(imageUris);
    }

    const serviceRecordId = await createServiceRecord({
      vehicleId,
      serviceRecord: {
        serviceCenter,
        serviceDate: serviceDate?.getTime() || 0,
        performed: performedServices.map((service) => ({
          category: service.category as ServiceCategoryType,
          serviceName: service.serviceName,
          notes: service.notes || '',
          warrantyId: undefined,
        })),
        storageIds: finalStorageIds,
      },
    });

    if (serviceRecordId) {
      navigation.navigate(RECORDS.RecordDetails, {
        recordId: serviceRecordId,
      });
    }
  };

  const isSubmitReady =
    !isEmptyString(serviceCenter) &&
    serviceDate &&
    performedServices.every((service) => !isEmptyString(service.serviceName));

  return (
    <Screen>
      <ScrollView contentContainerStyle={tw`pb-8`}>
        <SectionHeader
          title="Add Service Record"
          variant="titleLg"
          style={tw`mb-4`}
        />

        <InputGroup gap={4}>
          <ControlledDatePicker
            label="Service Date"
            value={serviceDate}
            onDateChange={setServiceDate}
            isEditing
          />

          <Input
            label="Service Center"
            value={serviceCenter}
            onChangeText={setServiceCenter}
            placeholder="Where was it serviced?"
            onClear={() => setServiceCenter('')}
          />

          <DocumentGallery
            existingReceipts={[]}
            removedReceiptIds={[]}
            onRemoveExisting={() => {}}
            pendingUris={imageUris}
            isEditing
            onRemovePending={removeImage}
            onAddPress={openImagePicker}
          />
        </InputGroup>

        <View style={tw`mt-4`}>
          {performedServices.map((service, index) => (
            <ServiceItemCard
              key={index}
              index={index}
              service={service}
              onUpdate={(updates) => handleUpdateService(index, updates)}
              onRemove={
                performedServices.length > 1
                  ? () => removeServiceItem(index)
                  : undefined
              }
              isEditing={true}
            />
          ))}

          <DashedButton title="Add Another Service" onPress={addServiceItem} />
        </View>

        <ButtonContainer>
          <ActionGroup error={error || uploadError}>
            <PrimaryButton
              title="Submit Record"
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
