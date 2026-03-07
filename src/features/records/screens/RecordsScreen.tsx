import React from 'react';
import { Screen } from '@/shared/components/Screen';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { useDashboardContext } from '@/providers/DashboardProvider';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';
import { EmptyState } from '@/shared/components/texts/EmptyState';
import { FlatList } from 'react-native';
import { RECORDS, RecordsStackParamList } from '@/navigation/routes';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import tw from '@/styles/tw';
import { useServiceRecords } from '@/domain/serviceRecords';
import { ServiceRecordCard } from '@/shared/components/cards/ServiceRecordCard';

export function RecordsScreen() {
  const navigation = useNavigation<NavigationProp<RecordsStackParamList>>();
  const { dashboard } = useDashboardContext();
  const vehicleId = dashboard?.active?.vehicle._id;

  const serviceRecords = useServiceRecords(vehicleId);

  if (!serviceRecords) {
    return <FullScreenLoading />;
  }

  if (serviceRecords.length === 0) {
    return (
      <EmptyState
        title="No service records found"
        description="Tap the plus icon in the header to add."
      />
    );
  }
  return (
    <Screen>
      <SectionHeader title="Service Records" variant="titleLg" />
      <FlatList
        data={serviceRecords}
        renderItem={({ item }) => (
          <ServiceRecordCard
            serviceRecord={item}
            onPress={() =>
              navigation.navigate(RECORDS.RecordDetails, {
                recordId: item._id,
              })
            }
          />
        )}
        contentContainerStyle={tw`pb-10`}
      />
    </Screen>
  );
}
