import React from 'react';
import { View } from 'react-native';
import tw from '@/styles/tw';
import { ActivityCard } from '@/shared/components/cards/ActivityCard';

export function ActivitySummary() {
  return (
    <View style={tw`flex-row gap-3`}>
      <ActivityCard
        label="Recent Activity"
        title="Oil Change"
        subtitle={`30,124 mi\nMarch 5, 2024`}
      />

      <ActivityCard
        label="Next Activity"
        title="Oil Change"
        subtitle={`40,124 mi\nJune 5, 2024`}
      />
    </View>
  );
}
