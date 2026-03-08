import { Text, TextProps } from 'react-native';
import { typography } from '@/styles/theme';

type Variant = keyof typeof typography;

type Props = TextProps & {
  variant?: Variant; // 'titleXL' | 'titleLg' | 'title' | 'body' | 'detail' | 'link'
  color?: string; // optional override
};

export function CustomText({ variant = 'body', color, style, ...rest }: Props) {
  return (
    <Text
      style={[{ color: color ?? '#F8FAFC' }, typography[variant], style]}
      {...rest}
    />
  );
}
