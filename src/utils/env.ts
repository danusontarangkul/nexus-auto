import { DEFAULT_CONVEX_URL } from '@/config/publicEnv';

/**
 * `EXPO_PUBLIC_*` is inlined when set (`.env` or EAS). Otherwise we use the
 * default so `expo start` works without a `.env` file.
 */
export const ENV = {
  CONVEX_URL: process.env.EXPO_PUBLIC_CONVEX_URL ?? DEFAULT_CONVEX_URL,
};

export function validateEnv() {
  const url = ENV.CONVEX_URL?.trim();
  if (!url) {
    throw new Error(
      'Missing Convex URL. Set EXPO_PUBLIC_CONVEX_URL in .env.local for local dev, or in eas.json / EAS env for builds.',
    );
  }
}
