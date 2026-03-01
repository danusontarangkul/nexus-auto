'use client';

import { useQuery } from 'convex/react';
import { Doc, Id } from '@convex/_generated/dataModel';
import { api } from '@convex/_generated/api';

export const useWarranties = (
  vehicleId: Id<'vehicles'>,
): Doc<'warranties'>[] | undefined => {
  return useQuery<typeof api.warranties.getWarrantiesByVehicleId>(
    api.warranties.getWarrantiesByVehicleId,
    {
      vehicleId,
    },
  );
};
