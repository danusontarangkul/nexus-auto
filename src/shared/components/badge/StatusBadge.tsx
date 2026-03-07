import React from 'react';
import { View } from 'react-native';
import tw from '@/styles/tw';
import { CustomText } from '@/shared/components/CustomText';

interface StatusBadgeProps {
  label: string;
  variant?: 'success' | 'muted';
}

export function StatusBadge({ label, variant = 'success' }: StatusBadgeProps) {
  return (
    <View
      style={tw.style(
        'px-3 py-1.5 rounded-lg ml-4',
        variant === 'success' ? 'bg-green-600' : 'bg-surface-700',
      )}
    >
      <CustomText variant="detail" style={tw`font-bold text-white`}>
        {label}
      </CustomText>
    </View>
  );
}
