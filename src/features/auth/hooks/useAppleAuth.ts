import { useState, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useAuthActions } from '@convex-dev/auth/react';
import { handleError } from '@/utils/error/errorAlert';
import { sanitizeAuthParams } from '@/utils/auth';

WebBrowser.maybeCompleteAuthSession();

export function useAppleAuth(onSuccess: () => Promise<void>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { signIn } = useAuthActions();

  const loginWithApple = useCallback(async () => {
    setIsLoading(true);
    try {
      const redirectTo =
        process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL || Linking.createURL('auth');
      const result = await signIn('apple', { redirectTo });
      const urlToOpen = result?.redirect?.toString();

      if (!urlToOpen) {
        throw new Error('No redirect URL');
      }

      const authResult = await WebBrowser.openAuthSessionAsync(
        urlToOpen,
        redirectTo,
      );

      if (authResult.type === 'success' && authResult.url) {
        const parsed = Linking.parse(authResult.url);
        let params: Record<string, string> = {};

        if (parsed.queryParams) {
          params = sanitizeAuthParams(parsed.queryParams);
        }

        // ConvexAuth uses the callback params (code/state/etc) to complete auth
        // and trigger `createOrUpdateUser` in `convex/auth.ts`.
        await signIn('apple', params);
        await onSuccess();
      } else {
        setIsLoading(false);
      }
    } catch (error: unknown) {
      setIsLoading(false);
      handleError(error, 'Apple Auth', 'Could not complete Apple sign-in.');
    } finally {
      setIsLoading(false);
    }
  }, [signIn, onSuccess]);

  return { loginWithApple, isLoading };
}
