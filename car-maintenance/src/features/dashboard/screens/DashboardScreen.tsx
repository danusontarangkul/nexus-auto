import React from 'react';
import { View } from 'react-native';
import { Screen } from '../../../shared/components/Screen';
import tw from '../../../styles/tw';
import { CustomText } from '../../../shared/components/CustomText';

export default function DashboardScreen() {
  return (
    <Screen>
      <View style={tw`mt-6 gap-3`}>
        <CustomText style={tw`text-2xl font-semibold text-ink-900`}>Dashboard</CustomText>
        {/* TODO: Recent Activity, Next Activity, Recommended Services, Vehicle Card */}
      </View>
    </Screen>
  );
}
