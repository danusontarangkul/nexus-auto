'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { setErrorFromConvexError } from '@/utils/error/errorHelper';
import { UpdateWarrantyInput } from '@convex/types';

export const useUpdateWarranty = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateWarrantyMutation = useMutation(api.warranties.updateWarranty);

  const updateWarranty = async (
    input: UpdateWarrantyInput,
  ): Promise<boolean | null> => {
    setIsLoading(true);
    setError(null);

    try {
      return await updateWarrantyMutation(input);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateWarranty,
    isLoading,
    error,
    setError,
  };
};
