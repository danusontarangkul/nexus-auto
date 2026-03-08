import { Image, ImageSourcePropType } from 'react-native';
import tw from '@/styles/tw';

type Props = { source: ImageSourcePropType; size?: number };

export function CircleImage({ source, size = 160 }: Props) {
  return (
    <Image
      source={source}
      style={tw.style('', {
        width: size,
        height: size,
        borderRadius: size / 2,
      })}
      resizeMode="cover"
    />
  );
}
