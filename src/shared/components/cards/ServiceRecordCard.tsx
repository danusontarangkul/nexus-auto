import { View } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from '@/shared/components/texts/CustomText';
import { Doc } from 'convex/_generated/dataModel';
import { formatDateFull } from '@/utils/format';
import { ClickableCard } from './ClickableCard';

interface Props {
  serviceRecord: Doc<'serviceRecords'>;
  onPress: () => void;
}

export function ServiceRecordCard({ serviceRecord, onPress }: Props) {
  return (
    <ClickableCard onPress={onPress}>
      <View style={tw`flex-1`}>
        <CustomText variant="title" color={tw.color('ink-900')}>
          {serviceRecord.performed[0].name}
        </CustomText>
        <CustomText variant="detail" color={tw.color('ink-300')}>
          {formatDateFull(serviceRecord.serviceDate)}
        </CustomText>
      </View>
    </ClickableCard>
  );
}
