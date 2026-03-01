export const sanitizeAuthParams = (
  params: Record<string, string | string[] | undefined> | null,
): Record<string, string> => {
  if (!params) return {};

  return Object.entries(params).reduce(
    (acc, [key, value]) => {
      if (typeof value === 'string') {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, string>,
  );
};
