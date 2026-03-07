'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { setErrorFromConvexError } from '@/utils/error/errorHelper';
import { Id } from '@convex/_generated/dataModel';

export const useDeleteVehicle = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteVehicleMutation = useMutation(api.vehicles.deleteVehicle);

  const deleteVehicle = async (vehicleId: Id<'vehicles'>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await deleteVehicleMutation({ vehicleId });
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteVehicle,
    isLoading,
    error,
    setError,
  };
};
