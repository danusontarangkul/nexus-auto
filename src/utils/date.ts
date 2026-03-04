export const formatExpiryDate = (
  timestamp: number | string | undefined | null,
): string => {
  if (!timestamp) {
    return 'Not set';
  }

  const dateInstance = new Date(timestamp);

  if (isNaN(dateInstance.getTime())) {
    return 'Not set';
  }

  return `Exp. ${dateInstance.toLocaleDateString()}`;
};
