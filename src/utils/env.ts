const REQUIRED_ENV_VARS = ['EXPO_PUBLIC_CONVEX_URL'] as const;

export function validateEnv() {
  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
      throw new Error(
        ` Missing Environment Variable: ${key}\n` +
          `Check your .env.local file or your build settings.`,
      );
    }
  }
}

export const ENV = {
  CONVEX_URL: process.env.EXPO_PUBLIC_CONVEX_URL!,
};
