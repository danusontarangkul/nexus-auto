// src/navigation/RootNavigator.tsx
import * as React from 'react';
import {
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import tw from '../styles/tw';
import DashboardScreen from '../features/dashboard/screens/DashboardScreen';
import { useAppState } from '../state/AppState';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../features/auth/screens/RegisterScreen';
import { AddCarStartScreen } from '../features/cars/screens/AddCarStartScreen';
import { EnterVinScreen } from '../features/cars/screens/EnterVinScreen';
import { EnterManualScreen } from '../features/cars/screens/EnterManualScreen';
import { UploadVinPhotoScreen } from '../features/cars/screens/UploadVinPhotoScreen';
import { ConfirmCarScreen } from '../features/cars/screens/ConfirmCarScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      {/* Add more tabs as needed */}
    </Tab.Navigator>
  );
}

const navTheme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'white' },
};

export function RootNavigator() {
  const { isAuthenticated, hasCar } = useAppState();
  return (
    <NavigationContainer theme={navTheme}>
      {!isAuthenticated ? (
        <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      ) : !hasCar ? (
        <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
          <Stack.Screen
            name="AddCarStart"
            component={AddCarStartScreen}
            options={{ title: 'Add a Car' }}
          />
          <Stack.Screen name="EnterVIN" component={EnterVinScreen} options={{ title: 'Enter VIN' }} />
          <Stack.Screen name="EnterManual" component={EnterManualScreen} options={{ title: 'Enter Details Manually' }} />
          <Stack.Screen name="UploadVINPhoto" component={UploadVinPhotoScreen} options={{ title: 'Scan VIN Barcode' }} />
          <Stack.Screen name="ConfirmCar" component={ConfirmCarScreen} options={{ title: 'Confirm Vehicle' }} />
        </Stack.Navigator>
      ) : (
        <AppTabs />
      )}
    </NavigationContainer>
  );
}
