import { View, Image, ImageSourcePropType } from 'react-native';
import { CustomText } from '@/shared/components/texts/CustomText';
import { VehicleData } from '@convex/types';
import tw from '@/styles/tw';

interface Props {
  car: VehicleData;
  plate: string;
  imageSource?: ImageSourcePropType;
}

export function VehiclePreviewCard({ car, plate, imageSource }: Props) {
  return (
    <View
      style={tw`bg-surface-600 rounded-xl p-4 border border-surface-border`}
    >
      <Image
        source={imageSource || require('@assets/tesla-model-3.avif')}
        style={tw`w-full h-40 rounded-lg mb-4`}
        resizeMode="cover"
      />

      <CustomText variant="titleLg" color={tw.color('ink-900')}>
        {`${car.year ?? ''} ${car.make ?? 'Unknown'} ${car.model ?? ''}`}
      </CustomText>

      <View style={tw`mt-2 gap-1`}>
        {car.manufacturer && (
          <CustomText color={tw.color('ink-700')}>
            Manufacturer: {car.manufacturer}
          </CustomText>
        )}
        <CustomText color={tw.color('ink-700')}>
          Body: {car.bodyClass || 'N/A'}
        </CustomText>
        <CustomText color={tw.color('ink-700')}>Plate: {plate}</CustomText>
      </View>
    </View>
  );
}
