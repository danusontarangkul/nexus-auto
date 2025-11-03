import React from 'react';
import { Text, View } from 'react-native';
import { Screen } from '../../../shared/components/Screen';
import tw from '../../../styles/tw';

export default function DashboardScreen() {
  return (
    <Screen>
      <View style={tw`mt-6 gap-3`}>
        <Text style={tw`text-2xl font-semibold text-ink-900`}>Dashboard</Text>
        {/* TODO: Recent Activity, Next Activity, Recommended Services, Vehicle Card */}
      </View>
    </Screen>
  );
}
