import React from 'react';
import { FlatList } from 'react-native';
import { Screen } from '@/shared/components/Screen';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { useDashboardContext } from '@/providers/DashboardProvider';
import { useWarranties } from '@/domain/warranties';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';
import { EmptyState } from '@/shared/components/texts/EmptyState';
import { WarrantyCard } from '@/shared/components/cards/WarrantyCard';
import { WarrantiesStackParamList, WARRANTIES } from '@/navigation/routes';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import tw from '@/styles/tw';
import { FILTER_OPTIONS, FilterType } from '@/utils/const';
import { SegmentedFilter } from '@/shared/components/filters/SegmentedFilter';
import { useListFilter } from '@/shared/hooks/useListFilter'; // Reusable hook
import { getEmptyMessage, WARRANTY_FILTER_LOGIC } from '../utils/utils';

export function WarrantiesScreen() {
  const navigation = useNavigation<NavigationProp<WarrantiesStackParamList>>();
  const { dashboard } = useDashboardContext();
  const vehicleId = dashboard?.active?.vehicle._id;

  const warranties = useWarranties(vehicleId);

  const { filter, setFilter, finalData, searchQuery, isSearchingEmpty } =
    useListFilter({
      data: warranties,
      filterLogic: WARRANTY_FILTER_LOGIC,
      headerTitle: 'Warranties',
      searchFields: (item) => [
        item.manufacturer ?? '',
        item.titleOfManufacturer ?? '',
        item.expiresAt.toString(),
      ],
      onAddPress: () => navigation.navigate(WARRANTIES.AddWarranty),
    });

  if (!warranties) {
    return <FullScreenLoading />;
  }

  if (warranties.length === 0) {
    return (
      <EmptyState
        title="No warranties found"
        description="Tap the plus icon in the header to add."
      />
    );
  }

  return (
    <Screen>
      <SectionHeader title="Warranties" variant="titleLg" />

      <SegmentedFilter
        options={FILTER_OPTIONS}
        selected={filter}
        onChange={setFilter}
      />

      {isSearchingEmpty ? (
        <EmptyState
          title={`No results for "${searchQuery}"`}
          description="Try a different term or check your category filter."
        />
      ) : finalData.length === 0 ? (
        <EmptyState title={getEmptyMessage(filter as FilterType)} />
      ) : (
        <FlatList
          data={finalData}
          renderItem={({ item }) => (
            <WarrantyCard
              warranty={item}
              onPress={() =>
                navigation.navigate(WARRANTIES.WarrantyDetails, {
                  warrantyId: item._id,
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
