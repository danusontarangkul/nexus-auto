import { useMemo } from 'react';
import { Id, Doc } from '@convex/_generated/dataModel';

interface WarrantyData {
  warranty: Doc<'warranties'>;
  receipts: Doc<'receipts'>[];
}

interface CurrentState {
  expiryDate: Date | null;
  removedReceiptIdsCount?: number;
  manufacturer: string;
  component: string;
  pendingImageCount?: number;
}

export function useWarrantyChanges(
  initial: WarrantyData | undefined | null,
  current: CurrentState,
) {
  return useMemo(() => {
    if (!initial) {
      return (
        current.expiryDate !== null ||
        current.manufacturer.trim() !== '' ||
        current.component.trim() !== '' ||
        (current.pendingImageCount ?? 0) > 0
      );
    }

    const war = initial.warranty;

    const manufacturerChanged =
      (war.manufacturer || '').trim() !== (current.manufacturer || '').trim();

    const titleChanged =
      (war.component || '').trim() !== (current.component || '').trim();

    const originalTime = war.expiresAt || 0;
    const currentTime = current.expiryDate?.getTime() || 0;
    const dateChanged = originalTime !== currentTime;

    const receiptsChanged =
      (current.removedReceiptIdsCount ?? 0) > 0 ||
      (current.pendingImageCount ?? 0) > 0;

    return (
      manufacturerChanged || titleChanged || dateChanged || receiptsChanged
    );
  }, [
    initial,
    current.expiryDate,
    current.manufacturer,
    current.component,
    current.removedReceiptIdsCount,
    current.pendingImageCount,
  ]);
}
