export const formatMaintenanceInterval = (
  miles: number | undefined | null,
): string => {
  if (!miles) {
    return 'No interval set';
  }

  const formattedMiles = miles.toLocaleString();

  return `Every ${formattedMiles} mi.`;
};
