import React, { useState } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { Screen } from '@/shared/components/Screen';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { useDashboardContext } from '@/providers/DashboardProvider';
import { useWarranties } from '@/domain/warranties';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';
import { EmptyState } from '@/shared/components/texts/EmptyState';
import { WarrantyCard } from '@/shared/components/cards/WarrantyCard';
import { WarrantiesStackParamList, WARRANTIES } from '@/navigation/routes';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { CustomText } from '@/shared/components/CustomText';
import tw from '@/styles/tw';
import { FILTER_OPTIONS, FilterType } from '@/utils/const';
import { SegmentedFilter } from '@/shared/components/filters/SegmentedFilter';
import { useFilter } from '@/shared/hooks/useFilter';
import { getEmptyMessage, WARRANTY_FILTER_LOGIC } from '../utils/utils';

export function WarrantiesScreen() {
  const navigation = useNavigation<NavigationProp<WarrantiesStackParamList>>();
  const { dashboard } = useDashboardContext();
  const vehicleId = dashboard?.active?.vehicle._id;
  const [filter, setFilter] = useState<FilterType>('all');

  const warranties = useWarranties(vehicleId);

  const filteredWarranties = useFilter(
    warranties,
    filter,
    WARRANTY_FILTER_LOGIC,
  );

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

  const emptyMessage = getEmptyMessage(filter);

  return (
    <Screen>
      <SectionHeader title="Warranties" variant="titleLg" />
      <SegmentedFilter
        options={FILTER_OPTIONS}
        selected={filter}
        onChange={setFilter}
      />
      {FILTER_OPTIONS.map(({ value, label }) => {
        const isSelected = filter === value;
        return (
          <TouchableOpacity
            key={value}
            onPress={() => setFilter(value)}
            activeOpacity={0.7}
            style={tw`pb-1`}
          >
            <CustomText
              variant="body"
              style={tw.style(
                isSelected ? 'font-bold text-ink-900' : 'text-ink-400',
              )}
            >
              {label}
            </CustomText>
            {isSelected && (
              <View
                style={tw`absolute bottom-0 left-0 right-0 h-0.5 bg-ink-900`}
              />
            )}
          </TouchableOpacity>
        );
      })}
      {filteredWarranties.length === 0 ? (
        <EmptyState title={emptyMessage} />
      ) : (
        <FlatList
          data={filteredWarranties}
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
        />
      )}
    </Screen>
  );
}
