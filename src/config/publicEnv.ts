/**
 * Default public Convex URLs for this project.
 *
 * - Local `expo start` does **not** read `eas.json`; Metro only inlines
 *   `EXPO_PUBLIC_*` from `.env` / `.env.local`. If those files are missing,
 *   we fall back to these values so the app still runs.
 * - EAS builds should set `EXPO_PUBLIC_CONVEX_URL` in `eas.json` (or EAS
 *   dashboard) to override when you use another deployment.
 *
 * Keep this in sync with `eas.json` → `build.*.env`.
 */
export const DEFAULT_CONVEX_URL = 'https://fiery-echidna-514.convex.cloud';
