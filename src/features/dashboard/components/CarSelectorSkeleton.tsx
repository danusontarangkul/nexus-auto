import { View } from 'react-native';
import tw from '@/styles/tw';
import { Skeleton } from '@/shared/components/loading/Skeleton';

export function CarSelectorSkeleton() {
  return (
    <View style={tw`flex-row items-center gap-3`}>
      <Skeleton style={tw`w-7 h-7 rounded-md`} />

      <Skeleton style={tw`w-48 h-8 rounded-lg`} />

      <Skeleton style={tw`w-4 h-4 rounded-full`} />
    </View>
  );
}
