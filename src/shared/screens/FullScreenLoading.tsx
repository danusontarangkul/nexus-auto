import { ActivityIndicator, View } from 'react-native';
import { palette } from '@/styles/theme';
import tw from '@/styles/tw';

export function FullScreenLoading() {
  return (
    <View style={tw`flex-1 justify-center items-center bg-surface-950`}>
      <ActivityIndicator size="large" color={palette.primary[500]} />
    </View>
  );
}
