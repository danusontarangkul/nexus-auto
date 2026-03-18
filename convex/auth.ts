import Apple from '@auth/core/providers/apple';
import Google from '@auth/core/providers/google';
import { Password } from '@convex-dev/auth/providers/Password';
import { convexAuth } from '@convex-dev/auth/server';

const ALLOWED_NATIVE_REDIRECTS = new Set([
  'nexus-auto://auth',
  'nexus-auto://apple-auth',
]);

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
      if (ALLOWED_NATIVE_REDIRECTS.has(redirectTo)) {
        return redirectTo;
      }

      return process.env.SITE_URL ?? '/';
    },
  },
});
