import { AppTabs } from './tabs/AppTabs';

import { DashboardProvider } from '@/providers/DashboardProvider';

export function AuthenticatedApp() {
  return (
    <DashboardProvider>
      <AppTabs />
    </DashboardProvider>
  );
}
