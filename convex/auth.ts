import Apple from '@auth/core/providers/apple';
import Google from '@auth/core/providers/google';
import { Password } from '@convex-dev/auth/providers/Password';
import { convexAuth } from '@convex-dev/auth/server';

/**
 * Expo `Linking.createURL('auth')` is not a single canonical string across
 * environments (e.g. `nexus-auto://auth` vs `nexus-auto:///auth`, and URLs
 * where the path segment is parsed as hostname). If the Convex redirect
 * callback rejects `redirectTo`, OAuth falls back to SITE_URL and the native
 * session never receives tokens — queries then see an unauthenticated user.
 */
function isAllowedNativeRedirect(redirectTo: string): boolean {
  if (!redirectTo.startsWith('nexus-auto:')) {
    return false;
  }
  try {
    const url = new URL(redirectTo);
    const apple = url.hostname === 'apple-auth' || url.pathname.endsWith('/apple-auth');
    const google =
      url.hostname === 'auth' || url.pathname === '/auth' || url.pathname.endsWith('/auth');
    return google || apple;
  } catch {
    return false;
  }
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Apple({
      profile: (appleInfo) => {
        const name = appleInfo.user
          ? `${appleInfo.user.name.firstName} ${appleInfo.user.name.lastName}`
          : undefined;
        return {
          id: appleInfo.sub,
          name: name,
          email: appleInfo.email,
        };
      },
    }),
    Google,
    Password,
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      if (args.existingUserId) {
        return args.existingUserId;
      }
      return ctx.db.insert('users', {
        ...args.profile,
        isActive: true,
      });
    },
    async redirect({ redirectTo }) {
      if (redirectTo.startsWith('/')) {
        return redirectTo;
      }
      if (isAllowedNativeRedirect(redirectTo)) {
        return redirectTo;
      }

      return process.env.SITE_URL ?? '/';
    },
  },
});
