import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { toastConvexError } from '@/utils/error/errorHelper';

export const useUpdateLastSelectedVehicle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const mutation = useMutation(api.users.updateLastSelectedVehicle);

  const updateLastSelectedVehicle = async (
    vehicleId: Id<'vehicles'>,
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      await mutation({ vehicleId });
      return true;
    } catch (err) {
      toastConvexError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateLastSelectedVehicle, isLoading };
};
