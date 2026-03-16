import { useMemo } from 'react';
import { View } from 'react-native';
import tw from '@/styles/tw';
import { ActivityCard } from '@/shared/components/cards/ActivityCard';
import { useDashboardContext } from '@/providers/DashboardProvider';
import {
  getMostRecentCompletedMaintenanceItem,
  getNextDueMaintenanceItem,
  formatRecentActivityDescription,
  formatRecentActivityFooter,
  formatNextActivityDescription,
  formatNextActivityFooter,
} from '@/utils/format';

export function ActivitySummary() {
  const { dashboard } = useDashboardContext();
  const items = dashboard?.active?.maintenanceItems ?? [];

  const mostRecent = useMemo(
    () => getMostRecentCompletedMaintenanceItem(items),
    [items],
  );
  const nextDue = useMemo(() => getNextDueMaintenanceItem(items), [items]);

  return (
    <View style={tw`flex-row gap-3`}>
      <ActivityCard
        label="Recent Activity"
        title={mostRecent?.serviceName ?? 'None'}
        description={formatRecentActivityDescription(mostRecent)}
        footer={formatRecentActivityFooter(mostRecent)}
      />

      <ActivityCard
        label="Next Activity"
        title={nextDue?.serviceName ?? '—'}
        description={formatNextActivityDescription(nextDue)}
        footer={formatNextActivityFooter(nextDue)}
      />
    </View>
  );
}
