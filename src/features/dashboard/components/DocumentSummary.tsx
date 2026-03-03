import { Card } from '@/shared/components/Card';
import { CustomText } from '@/shared/components/CustomText';
import tw from '@/styles/tw';
import { Doc } from '@convex/_generated/dataModel';
import { View } from 'react-native';

export function DocumentSummary({
  registration,
  insurance,
}: {
  registration: Doc<'registrations'> | null;
  insurance: Doc<'insurance'> | null;
}) {
  return (
    <View style={tw`flex-row gap-3`}>
      <Card style={tw`flex-1`}>
        <CustomText color={tw.color('ink-50')}>Registration</CustomText>
        <CustomText color={tw.color('ink-700')}>
          {registration
            ? `Exp. ${new Date(registration.expiresAt).toLocaleDateString()}`
            : 'Not set'}
        </CustomText>
      </Card>
      <Card style={tw`flex-1`}>
        <CustomText color={tw.color('ink-50')}>Insurance</CustomText>
        <CustomText color={tw.color('ink-700')}>
          {insurance
            ? `Exp. ${new Date(insurance.expiresAt).toLocaleDateString()}`
            : 'Not set'}
        </CustomText>
      </Card>
    </View>
  );
}
