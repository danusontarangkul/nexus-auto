import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import tw from '@/styles/tw';

interface DashedButtonProps extends TouchableOpacityProps {
  title: string;
}

export function DashedButton({ title, style, ...props }: DashedButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[
        tw`p-4 border-dashed border-2 border-blue-500 rounded-xl items-center justify-center`,
        props.disabled && tw`border-gray-300 opacity-50`,
        style,
      ]}
      {...props}
    >
      <Text style={tw`text-blue-500 font-bold text-base`}>{title}</Text>
    </TouchableOpacity>
  );
}
