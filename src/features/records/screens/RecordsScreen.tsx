import { FlatList } from 'react-native';
import { Screen } from '@/shared/components/screens/Screen';
import { SectionHeader } from '@/shared/components/headers/SectionHeader';
import { useDashboardContext } from '@/providers/DashboardProvider';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';
import { EmptyState } from '@/shared/components/texts/EmptyState';
import { RECORDS, RecordsStackParamList } from '@/navigation/routes';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import tw from '@/styles/tw';
import { useServiceRecords } from '@/domain/serviceRecords';
import { ServiceRecordCard } from '@/shared/components/cards/ServiceRecordCard';
import { SegmentedFilter } from '@/shared/components/filters/SegmentedFilter';
import { useListFilter } from '@/shared/hooks/useListFilter';
import {
  RECORD_FILTER_OPTIONS,
  RECORD_FILTER_LOGIC,
  getEmptyMessage,
} from '../utils/utils';

export function RecordsScreen() {
  const navigation = useNavigation<NavigationProp<RecordsStackParamList>>();
  const { dashboard } = useDashboardContext();
  const vehicleId = dashboard?.active?.vehicle._id;

  const serviceRecords = useServiceRecords(vehicleId);

  const { filter, setFilter, finalData, searchQuery, isSearchingEmpty } =
    useListFilter({
      data: serviceRecords,
      filterLogic: RECORD_FILTER_LOGIC,
      headerTitle: 'Service Records',
      searchFields: (item) => {
        const serviceDetails = item.performed.flatMap((performed) => [
          performed.serviceName ?? '',
          performed.notes ?? '',
        ]);
        return [
          ...serviceDetails,
          item.serviceCenter ?? '',
          item.serviceDate.toString(),
        ];
      },
      onAddPress: () => navigation.navigate(RECORDS.AddRecord),
    });

  if (!serviceRecords) {
    return <FullScreenLoading />;
  }

  if (serviceRecords.length === 0) {
    return (
      <Screen>
        <EmptyState
          title="No service records found"
          description="Tap the plus icon in the header to add."
        />
      </Screen>
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

      {isSearchingEmpty ? (
        <EmptyState
          title={`No results for "${searchQuery}"`}
          description="Try a different search term or change your category filter."
        />
      ) : finalData.length === 0 ? (
        <EmptyState title={getEmptyMessage(filter)} />
      ) : (
        <FlatList
          data={finalData}
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
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
}
