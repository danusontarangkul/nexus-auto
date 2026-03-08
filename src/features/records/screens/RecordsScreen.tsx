import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Screen } from '@/shared/components/Screen';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { useDashboardContext } from '@/providers/DashboardProvider';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';
import { EmptyState } from '@/shared/components/texts/EmptyState';
import { RECORDS, RecordsStackParamList } from '@/navigation/routes';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import tw from '@/styles/tw';
import { useServiceRecords } from '@/domain/serviceRecords';
import { ServiceRecordCard } from '@/shared/components/cards/ServiceRecordCard';
import { SegmentedFilter } from '@/shared/components/filters/SegmentedFilter';
import { useFilter } from '@/shared/hooks/useFilter';
import {
  RECORD_FILTER_OPTIONS,
  RecordFilterType,
  RECORD_FILTER_LOGIC,
  getEmptyMessage,
} from '../utils/utils';

export function RecordsScreen() {
  const navigation = useNavigation<NavigationProp<RecordsStackParamList>>();
  const { dashboard } = useDashboardContext();
  const vehicleId = dashboard?.active?.vehicle._id;
  const [filter, setFilter] = useState<RecordFilterType>('all');

  const serviceRecords = useServiceRecords(vehicleId);

  const filteredRecords = useFilter(
    serviceRecords,
    filter,
    RECORD_FILTER_LOGIC,
  );

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
      <SegmentedFilter
        options={RECORD_FILTER_OPTIONS}
        selected={filter}
        onChange={setFilter}
      />
      {filteredRecords.length === 0 ? (
        <EmptyState title={getEmptyMessage(filter)} />
      ) : (
        <FlatList
          data={filteredRecords}
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
      )}
    </Screen>
  );
}
