import { Card } from '@/shared/components/Card';
import { CustomText } from '@/shared/components/CustomText';
import tw from '@/styles/tw';
import { View } from 'react-native';

export function ActivitySummary() {
  // Placeholder logic - you can pass real data here later
  return (
    <View style={tw`flex-row gap-3`}>
      <Card style={tw`flex-1`}>
        <CustomText color={tw.color('ink-700')}>Recent Activity</CustomText>
        <CustomText variant="title" color={tw.color('ink-50')} style={tw`mt-1`}>
          Oil Change
        </CustomText>
        <CustomText color={tw.color('ink-700')}>
          30,124 mi{'\n'}March 5, 2024
        </CustomText>
      </Card>
      <Card style={tw`flex-1`}>
        <CustomText color={tw.color('ink-700')}>Next Activity</CustomText>
        <CustomText variant="title" color={tw.color('ink-50')} style={tw`mt-1`}>
          Oil Change
        </CustomText>
        <CustomText color={tw.color('ink-700')}>
          40,124 mi{'\n'}June 5, 2024
        </CustomText>
      </Card>
    </View>
  );
}
