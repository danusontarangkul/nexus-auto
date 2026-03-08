import { StyleProp, ViewStyle } from 'react-native';
import { CustomText } from '../texts/CustomText';
import tw from '@/styles/tw';

type SectionHeaderProps = {
  title: string;
  variant?: 'title' | 'titleLg' | 'titleXL' | 'body';
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function SectionHeader({
  title,
  variant = 'title',
  color = tw.color('ink-50'),
  style,
}: SectionHeaderProps) {
  return (
    <CustomText variant={variant} color={color} style={[tw`mt-6 mb-2`, style]}>
      {title}
    </CustomText>
  );
}
