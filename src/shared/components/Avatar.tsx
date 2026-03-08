import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from './CustomText';
import { getInitials } from '@/utils/format';

interface AvatarProps {
  name?: string | null;
  image?: string | null;
  onPress?: () => void;
  size?: number;
  bgColor?: string;
}

export function Avatar({
  name,
  image,
  onPress,
  size = 48,
  bgColor,
}: AvatarProps) {
  const initials = getInitials(name);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
      style={[
        tw`rounded-full items-center justify-center overflow-hidden`,
        {
          width: size,
          height: size,
          backgroundColor: bgColor || tw.color('surface-800'),
        },
      ]}
    >
      {image ? (
        <Image
          source={{ uri: image }}
          style={tw`w-full h-full`}
          resizeMode="cover"
        />
      ) : (
        <CustomText
          variant="body"
          style={[tw`text-white font-bold`, { fontSize: size * 0.4 }]}
        >
          {initials}
        </CustomText>
      )}
    </TouchableOpacity>
  );
}
