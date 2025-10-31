// src/navigation/RootNavigator.tsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, Pressable } from 'react-native';
import tw from '../styles/tw';
import { ui } from '../styles/ui';

type RootStackParamList = {
  Home: undefined;
  Details: { itemId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={ui.screen}>
      <View style={tw`flex-1 items-center justify-center`}>
        <Text style={ui.h1}>Car Maintenance App 🚗</Text>
        <Text style={ui.body}>Welcome back!</Text>

        <Pressable
          style={tw.style(ui.btn, ui.btnPrimary, tw`mt-6`)}
          onPress={() => navigation.navigate('Details', { itemId: 42 })}
        >
          <Text style={ui.btnPrimaryText}>Go to Details</Text>
        </Pressable>
      </View>
    </View>
  );
}

function DetailsScreen({ route }: any) {
  const { itemId } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20 }}>Details Screen</Text>
      <Text>Item ID: {itemId}</Text>
    </View>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
