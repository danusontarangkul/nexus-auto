import { useMemo } from 'react';
import { Id } from '@convex/_generated/dataModel';

interface RegistrationData {
  expiresAt: number;
}

interface CurrentState {
  expiryDate: Date | null;
  removedReceiptIds: Id<'receipts'>[];
  imageUris: string[];
}

export function useRegistrationChanges(
  initial: RegistrationData | undefined | null,
  current: CurrentState,
) {
  return useMemo(() => {
    if (!initial)
      return current.expiryDate !== null || current.imageUris.length > 0;

    const originalTime = initial.expiresAt;
    const currentTime = current.expiryDate?.getTime() ?? null;

    const dateChanged = originalTime !== currentTime;
    const documentsRemoved = current.removedReceiptIds.length > 0;
    const newPhotosAdded = current.imageUris.length > 0;

    return dateChanged || documentsRemoved || newPhotosAdded;
  }, [
    initial,
    current.expiryDate,
    current.removedReceiptIds,
    current.imageUris,
  ]);
}
