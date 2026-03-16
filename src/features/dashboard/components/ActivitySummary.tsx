import { useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import tw from '@/styles/tw';
import { ActivityCard } from '@/shared/components/cards/ActivityCard';
import { useDashboardContext } from '@/providers/DashboardProvider';
import {
  getMostRecentCompletedMaintenanceItem,
  getNextDueMaintenanceItem,
  formatRecentActivityTitle,
  formatNextActivityTitle,
  formatRecentActivityDescription,
  formatRecentActivityFooter,
  formatNextActivityDescription,
  formatNextActivityFooter,
} from '@/utils/format';
import { DASHBOARD, DashboardStackParamList } from '@/navigation/routes';

export function ActivitySummary() {
  const { dashboard } = useDashboardContext();
  const items = dashboard?.active?.maintenanceItems ?? [];
  const navigation = useNavigation<NavigationProp<DashboardStackParamList>>();

  const mostRecent = useMemo(
    () => getMostRecentCompletedMaintenanceItem(items),
    [items],
  );
  const nextDue = useMemo(() => getNextDueMaintenanceItem(items), [items]);

  const handleRecentActivityPress = useCallback(() => {
    if (mostRecent?.lastDoneRecordId) {
      navigation.navigate(DASHBOARD.ServiceRecordDetails, {
        recordId: mostRecent.lastDoneRecordId,
      });
    }
  }, [navigation, mostRecent?.lastDoneRecordId]);

  return (
    <View style={tw`flex-row gap-3`}>
      <ActivityCard
        label="Recent Activity"
        title={formatRecentActivityTitle(mostRecent)}
        description={formatRecentActivityDescription(mostRecent)}
        footer={formatRecentActivityFooter(mostRecent)}
        onPress={
          mostRecent?.lastDoneRecordId ? handleRecentActivityPress : undefined
        }
      />

      <ActivityCard
        label="Next Activity"
        title={formatNextActivityTitle(nextDue)}
        description={formatNextActivityDescription(nextDue)}
        footer={formatNextActivityFooter(nextDue)}
      />
    </View>
  );
}
