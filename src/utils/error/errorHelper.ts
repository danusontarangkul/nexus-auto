import Toast from 'react-native-toast-message';

export const AUTH_REQUIRED_ERROR_MESSAGE =
  'Authentication required. Please log in.';

interface ConvexErrorLike {
  data?: unknown;
}

export function getErrorMessage(error: unknown): string {
  const fallback = 'Something went wrong. Please try again.';

  if (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof (error as ConvexErrorLike).data === 'string'
  ) {
    return (error as ConvexErrorLike).data as string;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallback;
}

export function isAuthRequiredError(error: unknown): boolean {
  return getErrorMessage(error) === AUTH_REQUIRED_ERROR_MESSAGE;
}

export function getErrorFallbackHeadline(explicitTitle?: string): string {
  return explicitTitle || 'Oops!';
}

export function getErrorFallbackHomeButtonTitle(error: unknown): string {
  return isAuthRequiredError(error) ? 'Go to sign in' : 'Return to Dashboard';
}

export function setErrorFromConvexError(
  error: unknown,
  setError: (msg: string | null) => void,
): void {
  const message = getErrorMessage(error);
  console.error('[Action Failure]:', error);
  setError(message);
}

export function toastConvexError(
  error: unknown,
  title: string = 'Action Failed',
): void {
  const message = getErrorMessage(error);

  console.error(`[${title}]:`, error);

  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
    position: 'bottom',
    visibilityTime: 4000,
    autoHide: true,
  });
}
