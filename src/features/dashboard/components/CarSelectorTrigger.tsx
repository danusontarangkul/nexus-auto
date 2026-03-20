import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@/shared/components/texts/CustomText';
import { VehicleListItem } from '@convex/types';
import tw from '@/styles/tw';
import { CarSelectorSkeleton } from './CarSelectorSkeleton';
import { formatCarDisplayName } from '../utils/format';

type TriggerProps = {
  currentCar?: VehicleListItem;
  onPress: () => void;
  isLoading?: boolean;
};

export function CarSelectorTrigger({
  currentCar,
  onPress,
  isLoading,
}: TriggerProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={tw`flex-row items-center gap-3 py-1`}
    >
      {isLoading ? (
        <CarSelectorSkeleton />
      ) : (
        <>
          <Ionicons name="car-outline" size={28} color="white" />
          <View style={tw`flex-row items-center`}>
            <CustomText
              variant="titleXL"
              color={tw.color('ink-50')}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={tw`mr-1`}
            >
              {formatCarDisplayName(currentCar)}
            </CustomText>
            <Ionicons
              name="chevron-down"
              size={18}
              color={tw.color('ink-500')}
            />
          </View>
        </>
      )}
    </Pressable>
  );
}
