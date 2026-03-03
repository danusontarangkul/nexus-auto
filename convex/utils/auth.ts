import { ConvexError } from 'convex/values';
import { QueryCtx, MutationCtx, ActionCtx } from '../_generated/server';
import { internal } from '../_generated/api';
import { Doc } from '../_generated/dataModel';
import { getAuthUserId } from '@convex-dev/auth/server';
import { throwDomainError } from './errors';

export async function getRevenueCatId(
  ctx: QueryCtx | MutationCtx | ActionCtx,
): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.subject) {
    return 'dev_test_user_123'; // ← this is your placeholder
  }
  if (!identity?.subject) {
    throw new ConvexError({
      code: 'unauthenticated',
      message: 'Please restart the app or restore purchases.',
    });
  }

  return identity.subject;
}

// export async function getCurrentUser(
//   ctx: QueryCtx | MutationCtx | ActionCtx,
// ): Promise<Doc<'users'>> {
//   const revenueCatId = await getRevenueCatId(ctx);

//   return validateUser(
//     await ctx.runQuery(internal.users.getUserByRevenueCatIdInternal, {
//       revenueCatId,
//     }),
//   );
// }

export const getCurrentUser = async (
  ctx: QueryCtx | MutationCtx,
): Promise<Doc<'users'>> => {
  const userId = await getAuthUserId(ctx);

  if (userId === null) {
    throwDomainError(
      'getCurrentUser',
      'Authentication required. Please log in.',
    );
  }

  const user = await ctx.db.get(userId);
  if (!user) {
    throwDomainError('getCurrentUser', 'User account not found.');
  }

  if (user.isActive === false) {
    throwDomainError('getCurrentUser', 'This account has been deactivated.');
  }

  return user;
};

export const getCurrentActionUser = async (
  ctx: ActionCtx,
): Promise<Doc<'users'>> => {
  const userId = await getAuthUserId(ctx);

  if (userId === null) {
    throwDomainError(
      'getCurrentUser',
      'Authentication required. Please log in.',
    );
  }

  const user = await ctx.runQuery(internal.users.getUserByIdInternal, {
    userId,
  });
  if (!user) {
    throwDomainError('getCurrentUser', 'User account not found.');
  }

  if (user.isActive === false) {
    throwDomainError('getCurrentUser', 'This account has been deactivated.');
  }

  return user;
};
