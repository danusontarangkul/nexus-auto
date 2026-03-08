import React, { useEffect, useState } from 'react';
import { Id } from '@convex/_generated/dataModel';
import { Screen } from '@/shared/components/Screen';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';
import { useEditableHeader } from '@/navigation/hooks/useEditableHeader';
import { ActionGroup } from '@/shared/components/ActionGroup';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { ButtonContainer } from '@/shared/components/ButtonContainer';
import { usePhotoAttachment } from '@/shared/hooks/usePhotoAttachment';
import { useRecordsRouteParams } from '../hooks/useRecordRouteParams';
import { useServiceRecordChanges } from '../hooks/useRecordChanges';
import {
  useServiceRecord,
  useUpdateServiceRecord,
} from '@/domain/serviceRecords';
import { ControlledDatePicker } from '@/shared/components/inputs/ControlledDatePicker';
import { ControlledInput } from '@/shared/components/inputs/ControlledInput';
import { SERVICE_CATEGORIES, SERVICES_BY_CATEGORY } from '@/utils/const';
import { ControlledCategoryPicker } from '@/shared/components/inputs/ControlledCategoryPicker';
import { ControlledNumberInput } from '@/shared/components/inputs/ControlledNumberInput';
import { DocumentGallery } from '@/shared/components/camera/DocumentGallery';
import { InputGroup } from '@/shared/components/InputGroup';
import { ScrollContainer } from '@/shared/components/containers/ScrollContainer';
import { toDateOrNull } from '@/utils/date';
import { isEmptyString } from '@/utils/format';

export function RecordsDetailsScreen() {
  const { recordId } = useRecordsRouteParams();
  const serviceRecord = useServiceRecord(recordId);
  const [serviceDate, setServiceDate] = useState<Date | null>(null);
  const [serviceCenter, setServiceCenter] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [services, setServices] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [cost, setCost] = useState<number>(0);
  const [removedReceiptIds, setRemovedReceiptIds] = useState<Id<'receipts'>[]>(
    [],
  );
  const [storageIds, setStorageIds] = useState<Id<'_storage'>[]>([]);
  const [pendingUris, setPendingUris] = useState<string[]>([]);
  const { openImagePicker, imageUris, removeImage } = usePhotoAttachment();

  const { updateServiceRecord, isLoading, error } = useUpdateServiceRecord();

  const { isEditing, setIsEditing } = useEditableHeader(
    serviceRecord?.serviceRecord.performed[0].name || '',
    !!serviceRecord,
  );

  useEffect(() => {
    setServiceDate(toDateOrNull(serviceRecord?.serviceRecord.serviceDate));
    setServiceCenter(serviceRecord?.serviceRecord.serviceCenter || '');
    setCategory(serviceRecord?.serviceRecord.performed[0].category || '');
    setName(serviceRecord?.serviceRecord.performed[0].name || '');
    setNotes(serviceRecord?.serviceRecord.performed[0].notes || '');
    setCost(serviceRecord?.serviceRecord.performed[0].cost || 0);
    setServices(serviceRecord?.serviceRecord.performed[0].templateItemId || '');
  }, [serviceRecord]);

  const hasChanges = useServiceRecordChanges(serviceRecord, {
    serviceDate,
    serviceCenter,
    category,
    services,
    name,
    notes,
    cost,
  });

  const isValid = !isEmptyString(serviceCenter) && serviceDate;

  const handleSave = async () => {
    if (!serviceRecord) return;
    const existing = serviceRecord.serviceRecord.performed[0];
    const success = await updateServiceRecord({
      serviceRecordId: recordId,
      updates: {
        performed: [
          {
            ...existing,
            category,
            name,
            notes,
            cost,
            templateItemId: services
              ? (services as Id<'maintenanceItems'>)
              : undefined,
            warrantyId: existing.warrantyId ?? undefined,
          },
        ],
        serviceDate: serviceDate?.getTime() || 0,
        storageIds: storageIds,
        receiptIdsToRemove: removedReceiptIds,
        serviceCenter: serviceCenter,
      },
    });
    if (success) {
      setIsEditing(false);
    }
  };

  if (!serviceRecord) {
    return <FullScreenLoading />;
  }

  return (
    <Screen>
      <ScrollContainer>
        <SectionHeader
          title={serviceRecord.serviceRecord.performed[0].name}
          variant="titleLg"
        />
        <InputGroup>
          <ControlledDatePicker
            label="Service Date"
            value={serviceDate}
            onDateChange={setServiceDate}
            isEditing={isEditing}
          />
          <ControlledInput
            label="Service Center"
            value={serviceCenter}
            onChangeText={setServiceCenter}
            isEditing={isEditing}
          />
          <ControlledCategoryPicker
            label="Category"
            value={category}
            options={SERVICE_CATEGORIES}
            onSelect={setCategory}
            isEditing={isEditing}
          />
          <ControlledCategoryPicker
            label="Services"
            value={services}
            options={SERVICES_BY_CATEGORY['oil_fluids']}
            onSelect={setServices}
            isEditing={isEditing}
          />
          <ControlledInput
            label="Name"
            value={name}
            onChangeText={setName}
            isEditing={isEditing}
          />
          <ControlledInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            isEditing={isEditing}
          />
          <ControlledNumberInput
            label="Cost"
            value={cost}
            onChangeNumber={setCost}
            isEditing={isEditing}
          />
        </InputGroup>
        <DocumentGallery
          existingReceipts={serviceRecord.receipts}
          removedReceiptIds={removedReceiptIds}
          onRemoveExisting={(id) =>
            setRemovedReceiptIds((prev: Id<'receipts'>[]) => [...prev, id])
          }
          pendingUris={imageUris}
          isEditing={isEditing}
          onRemovePending={removeImage}
          onAddPress={openImagePicker}
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
      </ScrollContainer>
    </Screen>
  );
}
