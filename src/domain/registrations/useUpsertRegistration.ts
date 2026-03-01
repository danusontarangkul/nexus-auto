'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { setErrorFromConvexError } from '@/utils/error/errorHelper';
import { UpsertRegistrationInput } from '@convex/types';

export const useUpsertRegistration = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const upsertRegistrationMutation = useMutation(
    api.registrations.upsertRegistration,
  );

  const upsertRegistration = async (
    input: UpsertRegistrationInput,
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await upsertRegistrationMutation(input);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    upsertRegistration,
    isLoading,
    error,
    setError,
  };
};
