import { View } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from '@/shared/components/texts/CustomText';
import { Doc } from 'convex/_generated/dataModel';
import { formatDateFull } from '@/utils/format';
import { ClickableCard } from './ClickableCard';
import { CategoryBadge } from '../badge/CategoryBadge';
import { getServiceRecordLabels } from '@/features/records/utils/utils';

interface Props {
  serviceRecord: Doc<'serviceRecords'>;
  onPress: () => void;
}

export function ServiceRecordCard({ serviceRecord, onPress }: Props) {
  const badges = getServiceRecordLabels(serviceRecord.performed);

  return (
    <ClickableCard onPress={onPress} style={tw`py-3`}>
      <View style={tw`flex-1`}>
        <View style={tw`flex-row justify-between items-start`}>
          <CustomText
            variant="title"
            color={tw.color('ink-900')}
            style={tw`flex-1 mr-2`}
          >
            {serviceRecord.serviceCenter || 'Unknown Location'}
          </CustomText>
          <CustomText variant="detail" color={tw.color('ink-300')}>
            {formatDateFull(serviceRecord.serviceDate)}
          </CustomText>
        </View>

        <View style={tw`flex-row flex-wrap mt-2`}>
          {badges.map((badge, index) => (
            <CategoryBadge
              key={`${badge}-${index}`}
              label={badge}
              style={tw`mr-1.5 mb-1.5`}
            />
          ))}
        </View>
      </View>
    </ClickableCard>
  );
}
