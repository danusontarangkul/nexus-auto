import { Pressable, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@/shared/components/texts/CustomText';
import { VehicleListItem } from '@convex/types';
import tw from '@/styles/tw';
import { palette } from '@/styles/theme';

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
      style={tw`flex-row items-center gap-1 py-1`}
      accessibilityLabel="Choose a car"
      accessibilityRole="button"
    >
      <Ionicons name="car-outline" size={28} color="white" />

      <View style={tw`flex-row items-center gap-1`}>
        <CustomText variant="titleXL" color={tw.color('ink-50')}>
          {currentCar
            ? `${currentCar.year} ${currentCar.make} ${currentCar.model}`
            : 'Select car'}
        </CustomText>

        {isLoading ? (
          <ActivityIndicator size="small" color={palette.primary[500]} />
        ) : (
          <Ionicons name="chevron-down" size={18} color={tw.color('ink-500')} />
        )}
      </View>
    </Pressable>
  );
}
