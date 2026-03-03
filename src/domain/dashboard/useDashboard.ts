'use client';

import { Dashboard } from '@convex/types';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';

export const useDashboard = (): Dashboard | undefined => {
  return useQuery<typeof api.dashboards.getDashboard>(
    api.dashboards.getDashboard,
    {},
  );
};
