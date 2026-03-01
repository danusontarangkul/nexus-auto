'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { setErrorFromConvexError } from '@/utils/error/errorHelper';
import { UpdateServiceRecordInput } from '@convex/types';

export const useUpdateServiceRecord = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateServiceRecordMutation = useMutation(
    api.serviceRecords.updateServiceRecord,
  );

  const updateServiceRecord = async (
    input: UpdateServiceRecordInput,
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await updateServiceRecordMutation(input);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateServiceRecord,
    isLoading,
    error,
    setError,
  };
};
