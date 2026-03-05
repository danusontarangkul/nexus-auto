import React from 'react';
import { View, ViewStyle } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from '../CustomText';

interface EmptyStateProps {
  title: string;
  description?: string;
  style?: ViewStyle;
}

export function EmptyState({ title, description, style }: EmptyStateProps) {
  return (
    <View style={[tw`items-center justify-center py-20 px-10`, style]}>
      <CustomText style={tw`text-ink-700 text-lg text-center font-semibold`}>
        {title}
      </CustomText>

      {description && (
        <CustomText style={tw`text-ink-400 mt-2 text-center`}>
          {description}
        </CustomText>
      )}
    </View>
  );
}
