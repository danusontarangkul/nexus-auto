import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { stackDark } from '../options';
import { WARRANTIES, WarrantiesStackParamList } from '../routes';
import { WarrantiesScreen } from '@/features/warranties/screens/WarrantiesScreen';
import { AddWarrantyScreen } from '@/features/warranties/screens/AddWarranty';
import { BackHeader } from '../components/BackHeader';
import tw from '@/styles/tw';
import { WarrantiesDetailsScreen } from '@/features/warranties/screens/WarrantiesDetails';

const Stack = createNativeStackNavigator<WarrantiesStackParamList>();

export function WarrantiesStack() {
  return (
    <Stack.Navigator screenOptions={stackDark}>
      <Stack.Screen
        name={WARRANTIES.WarrantiesList}
        component={WarrantiesScreen}
      />

      <Stack.Screen
        name={WARRANTIES.AddWarranty}
        component={AddWarrantyScreen}
        options={{
          header: () => <BackHeader title="Add Warranty" skipTopInset={true} />,
        }}
      />
      <Stack.Screen
        name={WARRANTIES.WarrantyDetails}
        component={WarrantiesDetailsScreen}
        options={{
          header: () => (
            <BackHeader title="Warranty Details" skipTopInset={true} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
