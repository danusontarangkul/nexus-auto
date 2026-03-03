import React, { createContext, useContext, useMemo } from 'react';
import { useDashboard } from '@/domain/dashboard';
import { Dashboard } from '@convex/types';
import { FullScreenLoading } from '@/shared/screens/FullLoading';

interface DashboardContextType {
  dashboard: Dashboard;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const dashboard = useDashboard();

  const value = useMemo(() => (dashboard ? { dashboard } : null), [dashboard]);

  if (dashboard === undefined) {
    return <FullScreenLoading />;
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      'useDashboardContext must be used within a DashboardProvider',
    );
  }
  return context;
};
