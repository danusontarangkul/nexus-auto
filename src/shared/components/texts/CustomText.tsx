import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import { typography } from '@/styles/theme';
import { getTextDefaultColor } from '@/styles/utils';

type Variant = keyof typeof typography;

type Props = TextProps & {
  variant?: Variant;
  color?: string;
};

export function CustomText({ variant = 'body', color, style, ...rest }: Props) {
  const defaultColor = getTextDefaultColor(variant);

  return (
    <Text
      style={[
        { color: color ?? defaultColor },
        typography[variant],
        style as StyleProp<TextStyle>,
      ]}
      {...rest}
    />
  );
}
