import React from 'react';
import { Screen } from '@/shared/components/Screen';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { useDashboardContext } from '@/providers/DashboardProvider';
import { useWarranties } from '@/domain/warranties';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';
import { EmptyState } from '@/shared/components/texts/EmptyState';
import { FlatList } from 'react-native';
import { WarrantyCard } from '@/shared/components/cards/WarrantyCard';
import { WarrantiesStackParamList, WARRANTIES } from '@/navigation/routes';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import tw from '@/styles/tw';

export function WarrantiesScreen() {
  const navigation = useNavigation<NavigationProp<WarrantiesStackParamList>>();
  const { dashboard } = useDashboardContext();
  const vehicleId = dashboard?.active?.vehicle._id;

  const warranties = useWarranties(vehicleId);

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
      <FlatList
        data={warranties}
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
    </Screen>
  );
}
