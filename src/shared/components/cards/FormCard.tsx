import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import tw from '@/styles/tw';

interface FormCardProps {
  title: string;
  onRemove?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function FormCard({ title, onRemove, children, style }: FormCardProps) {
  return (
    <View style={[tw`mb-4 p-4 rounded-2xl bg-surface-900`, style]}>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text
          style={tw`text-xs font-bold text-gray-500 uppercase tracking-wider`}
        >
          {title}
        </Text>

        {onRemove && (
          <TouchableOpacity
            onPress={onRemove}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={tw`text-red-500 font-bold`}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      {children}
    </View>
  );
}
