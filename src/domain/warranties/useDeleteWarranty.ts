'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { toastConvexError } from '@/utils/error/errorHelper';

export const useDeleteWarranty = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteWarrantyMutation = useMutation(api.warranties.deleteWarranty);

  const deleteWarranty = async (
    warrantyId: Id<'warranties'>,
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await deleteWarrantyMutation({ warrantyId });
    } catch (error) {
      toastConvexError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteWarranty,
    isLoading,
    error,
    setError,
  };
};
