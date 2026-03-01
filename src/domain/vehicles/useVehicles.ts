'use client';

import { useQuery } from 'convex/react';
import { Doc } from '@convex/_generated/dataModel';
import { api } from '@convex/_generated/api';

export const useVehicles = (): Doc<'vehicles'>[] | undefined => {
  return useQuery<typeof api.vehicles.getVehiclesByUserId>(
    api.vehicles.getVehiclesByUserId,
    {},
  );
};
