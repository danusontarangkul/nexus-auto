import { useMemo } from 'react';
import { ServiceRecordWithReceipts, PerformedService } from '@convex/types';

interface CurrentState {
  serviceDate: Date | null;
  serviceCenter: string;
  performedServices: PerformedService[];
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
        current.performedServices.some(
          (s) => s.serviceName !== '' || s.notes !== '',
        ) ||
        (current.pendingImageCount ?? 0) > 0
      );
    }

    const rec = initial.serviceRecord;
    const initialPerformed = rec.performed || [];
    const currentPerformed = current.performedServices;

    const originalTime = rec.serviceDate || 0;
    const currentTime = current.serviceDate?.getTime() || 0;
    const serviceDateChanged = originalTime !== currentTime;

    const serviceCenterChanged =
      (rec.serviceCenter || '') !== (current.serviceCenter || '');

    let servicesArrayChanged = false;

    if (initialPerformed.length !== currentPerformed.length) {
      servicesArrayChanged = true;
    } else {
      servicesArrayChanged = initialPerformed.some((initialItem, index) => {
        const currentItem = currentPerformed[index];
        return (
          initialItem.category !== currentItem.category ||
          initialItem.serviceName !== currentItem.serviceName ||
          (initialItem.notes ?? '') !== (currentItem.notes ?? '') ||
          initialItem.maintenanceItemId !== currentItem.maintenanceItemId
        );
      });
    }

    const receiptsChanged =
      (current.removedReceiptIdsCount ?? 0) > 0 ||
      (current.pendingImageCount ?? 0) > 0;

    return (
      serviceDateChanged ||
      serviceCenterChanged ||
      servicesArrayChanged ||
      receiptsChanged
    );
  }, [
    initial,
    current.serviceDate,
    current.serviceCenter,
    current.performedServices,
    current.removedReceiptIdsCount,
    current.pendingImageCount,
  ]);
}
