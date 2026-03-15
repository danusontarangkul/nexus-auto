import { View } from 'react-native';
import { Doc } from '@convex/_generated/dataModel';
import tw from '@/styles/tw';
import { CustomText } from '@/shared/components/texts/CustomText';
import { MaintenanceCard } from '@/shared/components/cards/MaintenanceCard';

interface MaintenanceListProps {
  items: Doc<'maintenanceItems'>[];
  onItemPress?: (item: Doc<'maintenanceItems'>) => void;
}

export function MaintenanceList({ items, onItemPress }: MaintenanceListProps) {
  if (items.length === 0) {
    return (
      <CustomText color={tw.color('ink-700')}>
        No recommendations yet.
      </CustomText>
    );
  }

  return (
    <View style={tw`gap-3`}>
      {items.map((item) => (
        <MaintenanceCard
          key={item._id}
          item={item}
          onPress={onItemPress ? () => onItemPress(item) : undefined}
        />
      ))}
    </View>
  );
}
