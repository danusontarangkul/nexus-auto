'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { setErrorFromConvexError } from '@/utils/error/errorHelper';
import { UpdateVehicleInput } from '@convex/types';

export const useUpdateVehicle = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateVehicleMutation = useMutation(api.vehicles.updateVehicle);

  const updateVehicle = async (input: UpdateVehicleInput): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await updateVehicleMutation(input);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateVehicle,
    isLoading,
    error,
    setError,
  };
};
