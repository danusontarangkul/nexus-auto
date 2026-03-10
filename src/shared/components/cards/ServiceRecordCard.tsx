import { View } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from '@/shared/components/texts/CustomText';
import { Doc } from 'convex/_generated/dataModel';
import { formatDateFull } from '@/utils/format';
import { ClickableCard } from './ClickableCard';
import { CategoryBadge } from '../badge/CategoryBadge';
import { SERVICE_CATEGORIES } from '@/utils/const';

interface Props {
  serviceRecord: Doc<'serviceRecords'>;
  onPress: () => void;
}

export function ServiceRecordCard({ serviceRecord, onPress }: Props) {
  const performed = serviceRecord.performed[0];

  const categoryLabel =
    SERVICE_CATEGORIES.find((category) => category.value === performed.category)
      ?.label || performed.category;

  const badges = [categoryLabel, performed.name].filter(
    (value): value is string => !!value,
  );

  return (
    <ClickableCard onPress={onPress} style={tw`py-2`}>
      <View style={tw`flex-1`}>
        <CustomText variant="detail" color={tw.color('ink-300')}>
          {formatDateFull(serviceRecord.serviceDate)}
        </CustomText>
        <CustomText variant="title" color={tw.color('ink-900')}>
          {serviceRecord.serviceCenter}
        </CustomText>

        <View style={tw`flex-row flex-wrap mt-1`}>
          {badges.map((badge) => (
            <CategoryBadge key={badge} label={badge} style={tw`mr-2 mb-2`} />
          ))}
        </View>
      </View>
    </ClickableCard>
  );
}
