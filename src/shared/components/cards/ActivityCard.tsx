import { Pressable } from 'react-native';
import { Card } from '@/shared/components/cards/Card';
import { CustomText } from '@/shared/components/texts/CustomText';
import tw from '@/styles/tw';

interface ActivityCardProps {
  label: string;
  title: string;
  description?: string;
  footer?: string;
  onPress?: () => void;
}

export function ActivityCard({
  label,
  title,
  description,
  footer,
  onPress,
}: ActivityCardProps) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={tw`flex-1`}>
      <Card>
        <CustomText color={tw.color('ink-700')}>{label}</CustomText>

        <CustomText
          variant="title"
          color={tw.color('ink-50')}
          style={tw`mt-1`}
          numberOfLines={1}
        >
          {title}
        </CustomText>

        {description && (
          <CustomText color={tw.color('blue-400')} style={tw`mt-1`}>
            {description}
          </CustomText>
        )}

        <CustomText color={tw.color('ink-700')} style={tw`mt-0.5`}>
          {footer ?? ''}
        </CustomText>
      </Card>
    </Pressable>
  );
}
