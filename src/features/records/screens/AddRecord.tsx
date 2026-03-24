import { useEffect, useRef, useState } from 'react';
import { View, ScrollView } from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
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
import { isEmptyNumber, isEmptyString } from '@/utils/format';
import { ServiceCategoryType } from '@convex/types/literals';
import { PerformedService } from '@convex/types';
import tw from '@/styles/tw';
import { ServiceItemCard } from '../components/ServiceItemCard';
import { NumberInput } from '@/shared/components/inputs/NumberInput';
import { ROUTINE_DEFAULT_SERVICE_LABEL } from '@/utils/const';
import {
  getDefaultRoutinePerformedService,
  getServiceOptionsForCategory,
} from '../utils/utils';
import { ImageSourcePickerSheet } from '@/shared/components/sheets/ImageSourcePickerSheet';
import { useHardwareBackToRecordsList } from '@/navigation/hooks/useHardwareBackToRecordsList';

export function AddRecordScreen() {
  const navigation = useNavigation<NavigationProp<RecordsStackParamList>>();
  useHardwareBackToRecordsList(navigation);
  const route =
    useRoute<RouteProp<RecordsStackParamList, typeof RECORDS.AddRecord>>();
  const initialMaintenanceItemId = route.params?.initialMaintenanceItemId;

  const { dashboard } = useDashboardContext();

  const vehicleId = dashboard?.active?.vehicle._id;
  const maintenanceItems = dashboard?.active?.maintenanceItems;

  const { createServiceRecord, isLoading, error } = useCreateServiceRecord();

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

  const [serviceDate, setServiceDate] = useState<Date | null>(new Date());

  const [mileage, setMileage] = useState<number>(0);

  const [serviceCenter, setServiceCenter] = useState<string>('');

  const [performedServices, setPerformedServices] = useState<
    PerformedService[]
  >(() => [getDefaultRoutinePerformedService(undefined)]);

  const hasAppliedPrefill = useRef(false);

  useEffect(() => {
    if (!maintenanceItems?.length || hasAppliedPrefill.current) {
      return;
    }
    setPerformedServices((prev) =>
      prev.map((service) => {
        if (
          service.category !== 'routine' ||
          service.serviceName !== ROUTINE_DEFAULT_SERVICE_LABEL ||
          service.maintenanceItemId
        ) {
          return service;
        }
        const def = getDefaultRoutinePerformedService(maintenanceItems);
        return { ...service, maintenanceItemId: def.maintenanceItemId };
      }),
    );
  }, [maintenanceItems]);

  useEffect(() => {
    if (
      hasAppliedPrefill.current ||
      !initialMaintenanceItemId ||
      !maintenanceItems?.length
    ) {
      return;
    }
    const item = maintenanceItems.find(
      (maintenanceItem) => maintenanceItem._id === initialMaintenanceItemId,
    );
    if (!item) {
      return;
    }
    hasAppliedPrefill.current = true;
    setPerformedServices([
      {
        category: item.category,
        serviceName: item.serviceName,
        notes: '',
        maintenanceItemId: item._id,
      },
    ]);
  }, [initialMaintenanceItemId, maintenanceItems]);

  const getOptionsForCategory = (category: ServiceCategoryType) => {
    return getServiceOptionsForCategory(maintenanceItems, category);
  };

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
      getDefaultRoutinePerformedService(maintenanceItems),
    ]);
  };

  const removeServiceItem = (index: number) => {
    setPerformedServices((prev) => prev.filter((_, i) => i !== index));
  };

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
      mileage: Number(mileage) || 0,
      serviceRecord: {
        serviceCenter,
        serviceDate: serviceDate?.getTime() || 0,
        performed: performedServices.map((service) => ({
          category: service.category as ServiceCategoryType,
          serviceName: service.serviceName,
          notes: service.notes || '',
          warrantyId: undefined,
          maintenanceItemId: service.maintenanceItemId,
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
    !isEmptyNumber(mileage) &&
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

          <NumberInput
            label="Mileage"
            value={mileage}
            onChangeNumber={setMileage}
            placeholder="e.g. 45,000"
            keyboardType="numeric"
            onClear={() => setMileage(0)}
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
              specificServiceOptions={getOptionsForCategory(service.category)}
              maintenanceItems={maintenanceItems}
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

      <ImageSourcePickerSheet
        visible={isImageSourceSheetOpen}
        onClose={closeImageSourceSheet}
        onSelectCamera={() => selectImageSource('camera')}
        onSelectLibrary={() => selectImageSource('library')}
      />
    </Screen>
  );
}
