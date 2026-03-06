'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { setErrorFromConvexError } from '@/utils/error/errorHelper';
import { UpsertInsuranceInput } from '@convex/types';

export const useUpsertInsurance = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const upsertInsuranceMutation = useMutation(api.insurance.upsertInsurance);

  const upsertInsurance = async (
    input: UpsertInsuranceInput,
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await upsertInsuranceMutation(input);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    upsertInsurance,
    isLoading,
    error,
    setError,
  };
};
