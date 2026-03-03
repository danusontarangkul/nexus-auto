import { Card } from '@/shared/components/Card';
import { CustomText } from '@/shared/components/CustomText';
import tw from '@/styles/tw';
import { Doc } from '@convex/_generated/dataModel';
import { View } from 'react-native';

export function MaintenanceList({
  items,
}: {
  items: Doc<'maintenanceItems'>[];
}) {
  return (
    <View style={tw`gap-3`}>
      {items.length > 0 ? (
        items.map((item) => (
          <Card key={item._id}>
            <CustomText color={tw.color('ink-50')}>🛠️ {item.name}</CustomText>
            <CustomText color={tw.color('ink-700')}>
              Every {item.intervalMiles?.toLocaleString()} mi.
            </CustomText>
          </Card>
        ))
      ) : (
        <CustomText color={tw.color('ink-700')}>
          No recommendations yet.
        </CustomText>
      )}
    </View>
  );
}
