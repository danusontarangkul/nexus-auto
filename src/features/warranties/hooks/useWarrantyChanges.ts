import { useMemo } from 'react';
import { Id, Doc } from '@convex/_generated/dataModel';

interface WarrantyData {
  warranty: Doc<'warranties'>;
  receipts: Doc<'receipts'>[];
}

interface CurrentState {
  expiryDate: Date | null;
  removedReceiptIds: Id<'receipts'>[];
  manufacturer: string;
  titleOfManufacturer: string;
  pendingUris: string[];
}

export function useWarrantyChanges(
  initial: WarrantyData | undefined | null,
  current: CurrentState,
) {
  return useMemo(() => {
    if (!initial) {
      return (
        current.expiryDate !== null ||
        current.manufacturer !== '' ||
        current.titleOfManufacturer !== '' ||
        current.pendingUris.length > 0
      );
    }

    const manufacturerChanged =
      initial.warranty.manufacturer !== current.manufacturer;
    const titleChanged =
      initial.warranty.titleOfManufacturer !== current.titleOfManufacturer;

    const originalTime = initial.warranty.expiresAt;
    const currentTime = current.expiryDate?.getTime() ?? null;
    const dateChanged = originalTime !== currentTime;

    const documentsRemoved = current.removedReceiptIds.length > 0;
    const newPhotosAdded = current.pendingUris.length > 0;

    return (
      manufacturerChanged ||
      titleChanged ||
      dateChanged ||
      documentsRemoved ||
      newPhotosAdded
    );
  }, [
    initial,
    current.expiryDate,
    current.removedReceiptIds,
    current.manufacturer,
    current.titleOfManufacturer,
    current.pendingUris,
  ]);
}
