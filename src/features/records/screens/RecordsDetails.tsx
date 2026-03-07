import React, { useEffect, useState } from 'react';
import { Screen } from '@/shared/components/Screen';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';
import { useEditableHeader } from '@/navigation/hooks/useEditableHeader';
import { ActionGroup } from '@/shared/components/ActionGroup';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { ButtonContainer } from '@/shared/components/ButtonContainer';
import { usePhotoAttachment } from '@/shared/hooks/usePhotoAttachment';
import { useRecordsRouteParams } from '../hooks/useRecordRouteParams';
import {
  useServiceRecord,
  useUpdateServiceRecord,
} from '@/domain/serviceRecords';

export function RecordsDetailsScreen() {
  const { recordId } = useRecordsRouteParams();
  const serviceRecord = useServiceRecord(recordId);

  const { openImagePicker, imageUris, removeImage } = usePhotoAttachment();

  const { updateServiceRecord, isLoading, error } = useUpdateServiceRecord();

  const { isEditing, setIsEditing } = useEditableHeader(
    serviceRecord?.serviceRecord.performed[0].name || '',
    !!serviceRecord,
  );

  const handleSave = async () => {
    // const success = await updateServiceRecord({
    //   serviceRecordId: recordId,
    //   updates: {
    //     performed: serviceRecord?.serviceRecord.performed,
    //     serviceDate: serviceRecord?.serviceRecord.serviceDate,
    //     storageIds: serviceRecord?.serviceRecord.storageIds,
    //     receiptIdsToRemove: serviceRecord?.serviceRecord.receiptIdsToRemove,
    //   },
    // });
    // if (success) {
    //   setIsEditing(false);
    // }
  };

  if (!serviceRecord) {
    return <FullScreenLoading />;
  }

  return (
    <Screen>
      <SectionHeader
        title={serviceRecord.serviceRecord.performed[0].name}
        variant="titleLg"
      />

      {isEditing && (
        <ButtonContainer>
          <ActionGroup error={error}>
            <PrimaryButton
              title="Save"
              onPress={handleSave}
              isLoading={isLoading}
              //   disabled={!hasChanges || !isValid}
            />
          </ActionGroup>
        </ButtonContainer>
      )}
    </Screen>
  );
}
