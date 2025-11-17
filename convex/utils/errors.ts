export function handleActionError(
  error: unknown,
  actionName?: string
): { success: false; error: string } {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error(
    `[ACTION ERROR]${actionName ? ` ${actionName}` : ""}: ${message}`,
    { error, stack }
  );

  return {
    success: false,
    error: "Something went wrong. Please try again.",
  };
}
