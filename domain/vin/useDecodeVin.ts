'use client';

import { useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '@convex/_generated/api';
import { setErrorFromConvexError } from '@/utils/error/errorHelper';
import { DecodeVinInput, DecodeVinResult } from '@convex/types';

export const useDecodeVin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const decodeVinMutation = useAction(api.vin.decodeVin);

  const decodeVin = async (
    input: DecodeVinInput,
  ): Promise<DecodeVinResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      return await decodeVinMutation(input);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    decodeVin,
    isLoading,
    error,
    setError,
  };
};
