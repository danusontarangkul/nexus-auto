import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { setErrorFromConvexError } from '@/utils/error/errorHelper';

export const useDeleteUser = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const mutation = useMutation(api.users.deleteUser);

  const deleteUser = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await mutation();
      return true;
    } catch (err) {
      setErrorFromConvexError(err, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteUser, isLoading, error };
};
