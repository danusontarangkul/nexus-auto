'use client';

import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { InsuranceWithReceipts } from '@convex/types';
import { useQuery } from 'convex/react';

export const useInsurance = (
  vehicleId: Id<'vehicles'>,
): InsuranceWithReceipts | undefined => {
  return useQuery<typeof api.insurance.getInsuranceWithReceiptsByVehicleId>(
    api.insurance.getInsuranceWithReceiptsByVehicleId,
    {
      vehicleId,
    },
  );
};
