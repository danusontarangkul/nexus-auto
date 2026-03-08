import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import tw from '@/styles/tw';

interface ScrollContainerProps extends ScrollViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ScrollContainer({
  children,
  style,
  ...props
}: ScrollContainerProps) {
  return (
    <ScrollView
      style={[tw`flex-1 p-4`, style]}
      contentContainerStyle={tw`pb-8`}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </ScrollView>
  );
}
