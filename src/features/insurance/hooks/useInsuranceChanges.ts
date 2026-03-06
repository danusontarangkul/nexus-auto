import { useMemo } from 'react';
import { Id } from '@convex/_generated/dataModel';

interface InsuranceData {
  expiresAt: number;
  providerName: string;
}

interface CurrentState {
  providerName: string;
  expiryDate: Date | null;
  removedReceiptIds: Id<'receipts'>[];
  imageUris: string[];
}

export function useInsuranceChanges(
  initial: InsuranceData | undefined | null,
  current: CurrentState,
) {
  return useMemo(() => {
    if (!initial) {
      return (
        current.providerName.trim() !== '' ||
        current.expiryDate !== null ||
        current.imageUris.length > 0
      );
    }

    const originalTime = initial.expiresAt;
    const currentTime = current.expiryDate?.getTime() ?? null;

    // Comparison Logic
    const nameChanged = initial.providerName !== current.providerName;
    const dateChanged = originalTime !== currentTime;
    const documentsRemoved = current.removedReceiptIds.length > 0;
    const newPhotosAdded = current.imageUris.length > 0;

    return nameChanged || dateChanged || documentsRemoved || newPhotosAdded;
  }, [
    initial,
    current.providerName,
    current.expiryDate,
    current.removedReceiptIds,
    current.imageUris,
  ]);
}
