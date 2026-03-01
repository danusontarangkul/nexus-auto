'use client';

import { useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '@convex/_generated/api';
import { setErrorFromConvexError } from '@/utils/error/errorHelper';
import { CreateVehicleInput } from '../../../convex/types';
import { Id } from '@convex/_generated/dataModel';

export const useCreateVehicle = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createVehicleMutation = useAction(api.vehicles.insertVehicle);

  const createVehicle = async (
    input: CreateVehicleInput,
  ): Promise<{ vehicleId: Id<'vehicles'>; itemsAdded: number } | null> => {
    setIsLoading(true);
    setError(null);

    try {
      return await createVehicleMutation(input);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createVehicle,
    isLoading,
    error,
    setError,
  };
};
