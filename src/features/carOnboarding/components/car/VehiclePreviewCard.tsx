import { View } from 'react-native';
import { CustomText } from '@/shared/components/texts/CustomText';
import { VehicleData } from '@convex/types';
import tw from '@/styles/tw';
import { formatBodyClass, formatVehicleName } from '../../utils/format';

interface Props {
  car: VehicleData;
  plate: string;
}

export function VehiclePreviewCard({ car, plate }: Props) {
  return (
    <View
      style={tw`bg-surface-600 rounded-xl p-4 border border-surface-border`}
    >
      <CustomText variant="titleLg" color={tw.color('ink-900')}>
        {formatVehicleName(car)}
      </CustomText>

      <View style={tw`mt-2 gap-1`}>
        {car.manufacturer && (
          <CustomText color={tw.color('ink-700')}>
            Manufacturer: {car.manufacturer}
          </CustomText>
        )}
        <CustomText color={tw.color('ink-700')}>
          Body: {formatBodyClass(car.bodyClass)}
        </CustomText>
        <CustomText color={tw.color('ink-700')}>Plate: {plate}</CustomText>
      </View>
    </View>
  );
}
