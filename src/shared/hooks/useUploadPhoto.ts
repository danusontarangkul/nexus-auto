import { useState } from 'react';
import { useMutation } from 'convex/react';
import { setErrorFromConvexError } from '@/utils/error/errorHelper';
import { Id } from '@convex/_generated/dataModel';
import { api } from '@convex/_generated/api';

export function useUploadPhoto() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.image.generateUploadUrl);

  /**
   * Internal helper for a single upload
   */
  const performSingleUpload = async (
    uri: string,
  ): Promise<Id<'_storage'> | null> => {
    try {
      const postUrl = await generateUploadUrl();

      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error('File read failed');
      }

      const blob = await response.blob();

      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg' },
        body: blob,
      });

      if (!result.ok) {
        throw new Error('Upload failed');
      }

      const { storageId } = await result.json();
      return storageId;
    } catch (err) {
      console.error('Single upload error:', err);
      return null;
    }
  };

  /**
   * The Public Batch Helper
   */
  const uploadImages = async (uris: string[]): Promise<Id<'_storage'>[]> => {
    if (uris.length === 0) {
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const storageIds = await Promise.all(
        uris.map((uri) => performSingleUpload(uri)),
      );

      return storageIds.filter((id): id is Id<'_storage'> => id !== null);
    } catch (err) {
      setErrorFromConvexError(err, setError);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadImages,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
