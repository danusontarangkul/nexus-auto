import React from 'react';
import { Pressable } from 'react-native';
import { Card } from '@/shared/components/Card';
import { CustomText } from '@/shared/components/CustomText';
import tw from '@/styles/tw';
import { formatExpiryDate } from '@/utils/date';

interface DocumentCardProps {
  label: string;
  expiryDate?: number | string | null;
  onPress: () => void;
}

export function DocumentCard({
  label,
  expiryDate,
  onPress,
}: DocumentCardProps) {
  const dateString = formatExpiryDate(expiryDate);

  return (
    <Pressable onPress={onPress} style={tw`flex-1`}>
      <Card>
        <CustomText color={tw.color('ink-50')} variant="body">
          {label}
        </CustomText>
        <CustomText color={tw.color('ink-700')} style={tw`mt-1`}>
          {dateString}
        </CustomText>
      </Card>
    </Pressable>
  );
}
