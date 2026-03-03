import Toast from 'react-native-toast-message';

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

  return fallback;
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
