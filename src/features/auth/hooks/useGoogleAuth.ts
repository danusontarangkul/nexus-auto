import { useState, useCallback, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useAuthActions } from '@convex-dev/auth/react';
import { handleError } from '@/utils/error/errorAlert';
import { sanitizeAuthParams } from '@/utils/auth';

WebBrowser.maybeCompleteAuthSession();

function shouldHandleGoogleOAuthReturn(url: string): boolean {
  const lower = url.toLowerCase();
  if (lower.includes('apple-auth')) {
    return false;
  }
  if (lower.includes('code=') || lower.includes('error=')) {
    return true;
  }
  if (url.includes('auth')) {
    return true;
  }
  return false;
}

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { signIn } = useAuthActions();

  const handleDeepLink = useCallback(
    async (event: { url: string }) => {
      if (!shouldHandleGoogleOAuthReturn(event.url)) {
        return;
      }

      setIsLoading(true);
      try {
        const parsed = Linking.parse(event.url);

        let params: Record<string, string> = {};

        if (parsed.queryParams) {
          params = sanitizeAuthParams(parsed.queryParams);
        }

        await signIn('google', params);
      } catch (error) {
        handleError(error, 'Google Auth', 'Could not complete Google sign-in.');
      } finally {
        setIsLoading(false);
      }
    },
    [signIn],
  );

  useEffect(() => {
    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, [handleDeepLink]);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const redirectTo =
        process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL || Linking.createURL('auth');
      const result = await signIn('google', { redirectTo });
      const urlToOpen = result?.redirect?.toString();

      if (!urlToOpen) {
        throw new Error('No redirect URL');
      }

      const authResult = await WebBrowser.openAuthSessionAsync(
        urlToOpen,
        redirectTo,
      );

      if (authResult.type === 'success' && authResult.url) {
        await handleDeepLink({ url: authResult.url });
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      handleError(error, 'Google Auth', 'Could not complete Google sign-in.');
    }
  }, [signIn, handleDeepLink]);

  return { loginWithGoogle, isLoading };
}
