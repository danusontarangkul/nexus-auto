'use client';

import { useQuery } from 'convex/react';
import { Id } from '@convex/_generated/dataModel';
import { api } from '@convex/_generated/api';
import { WarrantyWithReceipts } from '@convex/types';

export const useWarranty = (
  warrantyId: Id<'warranties'>,
): WarrantyWithReceipts | undefined => {
  return useQuery<typeof api.warranties.getWarrantyById>(
    api.warranties.getWarrantyById,
    {
      warrantyId,
    },
  );
};
