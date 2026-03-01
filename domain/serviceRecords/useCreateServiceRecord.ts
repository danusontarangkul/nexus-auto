'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { setErrorFromConvexError } from '@/utils/error/errorHelper';
import { CreateServiceRecordInput } from '../../convex/types';
import { Id } from '../../convex/_generated/dataModel';

export const useCreateServiceRecord = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createServiceRecordMutation = useMutation(
    api.serviceRecords.insertServiceRecord,
  );

  const createServiceRecord = async (
    input: CreateServiceRecordInput,
  ): Promise<Id<'serviceRecords'> | null> => {
    setIsLoading(true);
    setError(null);

    try {
      return await createServiceRecordMutation(input);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createServiceRecord,
    isLoading,
    error,
    setError,
  };
};
