'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { setErrorFromConvexError } from '@/utils/error/errorHelper';

export const useDeleteServiceRecord = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteServiceRecordMutation = useMutation(
    api.serviceRecords.deleteServiceRecord,
  );

  const deleteServiceRecord = async (
    serviceRecordId: Id<'serviceRecords'>,
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await deleteServiceRecordMutation({ serviceRecordId });
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteServiceRecord,
    isLoading,
    error,
    setError,
  };
};
