import { useMemo } from 'react';
import { ServiceRecordWithReceipts } from '@convex/types';

interface CurrentState {
  serviceDate: Date | null;
  serviceCenter: string;
  category: string;
  services: string;
  name: string;
  notes: string;
  cost: number;
  removedReceiptIdsCount?: number;
  pendingImageCount?: number;
}

export function useServiceRecordChanges(
  initial: ServiceRecordWithReceipts | undefined | null,
  current: CurrentState,
) {
  return useMemo(() => {
    if (!initial) {
      return (
        current.serviceDate !== null ||
        current.serviceCenter !== '' ||
        current.category !== '' ||
        current.services !== '' ||
        current.name !== '' ||
        current.notes !== '' ||
        current.cost !== 0 ||
        (current.pendingImageCount ?? 0) > 0
      );
    }

    const rec = initial.serviceRecord;
    const performed = rec.performed[0] || {};

    const originalTime = rec.serviceDate || 0;
    const currentTime = current.serviceDate?.getTime() || 0;
    const serviceDateChanged = originalTime !== currentTime;

    const serviceCenterChanged =
      (rec.serviceCenter || '') !== (current.serviceCenter || '');
    const categoryChanged =
      (performed.category || '') !== (current.category || '');
    const servicesChanged =
      (performed.templateItemId || '') !== (current.services || '');
    const nameChanged = (performed.name || '') !== (current.name || '');
    const notesChanged = (performed.notes || '') !== (current.notes || '');

    const costChanged = (performed.cost || 0) !== (current.cost || 0);

    const receiptsChanged =
      (current.removedReceiptIdsCount ?? 0) > 0 ||
      (current.pendingImageCount ?? 0) > 0;

    return (
      serviceDateChanged ||
      serviceCenterChanged ||
      categoryChanged ||
      servicesChanged ||
      nameChanged ||
      notesChanged ||
      costChanged ||
      receiptsChanged
    );
  }, [
    initial,
    current.serviceDate,
    current.serviceCenter,
    current.category,
    current.services,
    current.name,
    current.notes,
    current.cost,
    current.removedReceiptIdsCount,
    current.pendingImageCount,
  ]);
}
