import { Alert } from 'react-native';

export const handleError = (
  error: unknown,
  context: string,
  userMessage?: string,
) => {
  console.error(`[${context}] Error:`, error);

  Alert.alert(
    'Something went wrong',
    userMessage || 'An unexpected error occurred. Please try again.',
  );
};
