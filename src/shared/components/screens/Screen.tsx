import { View, ViewProps } from 'react-native';
import { palette } from '@/styles/theme';

export function Screen({ style, ...rest }: ViewProps) {
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: palette.surface[950],
          paddingHorizontal: 20,
          paddingBottom: 20,
        },
        style,
      ]}
      {...rest}
    />
  );
}
