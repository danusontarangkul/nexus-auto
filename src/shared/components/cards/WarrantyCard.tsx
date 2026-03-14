import { View } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from '@/shared/components/texts/CustomText';
import { Doc } from 'convex/_generated/dataModel';
import { formatDateFull, isExpired } from '@/utils/format';
import { StatusBadge } from '../badge/StatusBadge';
import { ClickableCard } from './ClickableCard';

interface Props {
  warranty: Doc<'warranties'>;
  onPress: () => void;
}

export function WarrantyCard({ warranty, onPress }: Props) {
  const expired = isExpired(warranty.expiresAt);
  const isValid = warranty.isActive && !expired;

  return (
    <ClickableCard onPress={onPress}>
      <View style={tw`flex-1`}>
        <CustomText variant="title" color={tw.color('ink-900')}>
          {warranty.component}
        </CustomText>
        <CustomText variant="detail" color={tw.color('ink-300')}>
          Ends on {formatDateFull(warranty.expiresAt)}
        </CustomText>
      </View>

      <StatusBadge
        label={isValid ? 'Active' : 'Expired'}
        variant={isValid ? 'success' : 'muted'}
      />
    </ClickableCard>
  );
}
