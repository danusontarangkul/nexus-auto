'use client';

import { useQuery } from 'convex/react';
import { Doc, Id } from '@convex/_generated/dataModel';
import { api } from '@convex/_generated/api';

export const useVehicle = (
  vehicleId: Id<'vehicles'>,
): Doc<'vehicles'> | undefined => {
  return useQuery<typeof api.vehicles.getVehicleById>(
    api.vehicles.getVehicleById,
    {
      vehicleId,
    },
  );
};
