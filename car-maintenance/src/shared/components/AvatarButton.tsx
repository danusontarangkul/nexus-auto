import React from 'react';
import { Image, Pressable, ImageSourcePropType } from 'react-native';
import tw from '../../styles/tw';

type Props = { source: ImageSourcePropType; onPress?: () => void };

export function AvatarButton({ source, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={tw`ml-3`} accessibilityLabel="Profile">
      <Image source={source} style={tw`w-8 h-8 rounded-full`} />
    </Pressable>
  );
}
