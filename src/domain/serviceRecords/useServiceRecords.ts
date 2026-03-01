'use client';

import { useQuery } from 'convex/react';
import { Doc, Id } from '@convex/_generated/dataModel';
import { api } from '@convex/_generated/api';

export const useServiceRecords = (
  vehicleId: Id<'vehicles'>,
): Doc<'serviceRecords'>[] | undefined => {
  return useQuery<typeof api.serviceRecords.getServiceRecordsByVehicleId>(
    api.serviceRecords.getServiceRecordsByVehicleId,
    {
      vehicleId,
    },
  );
};
