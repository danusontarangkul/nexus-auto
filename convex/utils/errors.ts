import { ConvexError } from 'convex/values';

export function handleActionError(error: unknown, actionName: string): never {
  const message = isError(error) ? error.message : String(error);
  const stack = isError(error) ? error.stack : undefined;

  console.error(`[SYSTEM ERROR] ${actionName}: ${message}`, { stack });

  throw new ConvexError('Something went wrong. Please try again later.');
}

export function isError(error: unknown): error is Error {
  return (
    error instanceof Error ||
    (typeof error === 'object' && error !== null && 'message' in error)
  );
}

export function throwDomainError(
  actionName: string,
  message: string,
  context?: any,
): never {
  console.warn(`[DOMAIN WARNING] ${actionName}: ${message}`, context);
  throw new ConvexError(message);
}

export function mapAndHandleError(
  error: unknown,
  actionName: string,
  context?: Record<string, unknown>,
): never {
  if (isError(error)) {
    switch (error.message) {
      case 'VEHICLE_NOT_FOUND':
        throwDomainError(
          actionName,
          "We couldn't find a vehicle for that VIN.",
          context,
        );
      case 'NHTSA_API_DOWN':
        throwDomainError(
          actionName,
          'The vehicle database is currently unavailable.',
          context,
        );
      case 'TIMEOUT_ERROR':
      case 'ABORT_ERROR':
        throwDomainError(actionName, 'Request timed out.', context);
      case 'RATE_LIMIT_EXCEEDED':
        throwDomainError(actionName, 'Too many requests. ', context);
    }
  }

  handleActionError(error, actionName);
}
