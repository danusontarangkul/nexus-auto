import React from 'react';
import { Card } from '@/shared/components/Card';
import { CustomText } from '@/shared/components/CustomText';
import tw from '@/styles/tw';

interface ActivityCardProps {
  label: string;
  title: string;
  subtitle: string;
}

export function ActivityCard({ label, title, subtitle }: ActivityCardProps) {
  return (
    <Card style={tw`flex-1`}>
      <CustomText color={tw.color('ink-700')}>{label}</CustomText>
      <CustomText variant="title" color={tw.color('ink-50')} style={tw`mt-1`}>
        {title}
      </CustomText>
      <CustomText color={tw.color('ink-700')}>{subtitle}</CustomText>
    </Card>
  );
}
