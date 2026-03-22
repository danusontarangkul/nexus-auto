import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';

export function useInitialBoot() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();

  const vehicles = useQuery(
    api.vehicles.getVehiclesByUserId,
    isAuthenticated ? undefined : 'skip',
  );

  const isAppReady =
    !isAuthLoading && (!isAuthenticated || vehicles !== undefined);

  return {
    isLoading: !isAppReady,
    isAuthenticated,
    hasCar: !!(vehicles && vehicles.length > 0),
  };
}
