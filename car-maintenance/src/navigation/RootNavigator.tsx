// src/navigation/RootNavigator.tsx
import * as React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

const darkNav = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0F1115',
    card: '#14171C',
    border: '#2B313C',
    text: '#F8FAFC',
    primary: '#3B82F6',
  },
};

export function RootNavigator() {
  const { isAuthenticated, hasCar } = useAppState();

  const stackOptions = {
    headerStyle: { backgroundColor: '#14171C' },
    headerTitleStyle: { color: '#F8FAFC' },
    headerTintColor: '#F8FAFC',
  };

  return (
    <NavigationContainer theme={darkNav as any}>
      {!isAuthenticated ? (
        <Stack.Navigator screenOptions={stackOptions}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      ) : !hasCar ? (
        <Stack.Navigator screenOptions={stackOptions}>
          <Stack.Screen
            name="AddCarStart"
            component={AddCarStartScreen}
            options={{ title: 'Add a Car' }}
          />
          <Stack.Screen
            name="EnterVIN"
            component={EnterVinScreen}
            options={{ title: 'Enter VIN' }}
          />
          <Stack.Screen
            name="EnterManual"
            component={EnterManualScreen}
            options={{ title: 'Enter Details Manually' }}
          />
          <Stack.Screen
            name="UploadVINPhoto"
            component={UploadVinPhotoScreen}
            options={{ title: 'Scan VIN Barcode' }}
          />
          <Stack.Screen
            name="ConfirmCar"
            component={ConfirmCarScreen}
            options={{ title: 'Confirm Vehicle' }}
          />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#14171C' },
            headerTitleStyle: { color: '#F8FAFC' },
            tabBarStyle: {
              backgroundColor: '#14171C',
              borderTopColor: '#2B313C',
            },
            tabBarActiveTintColor: '#F8FAFC',
            tabBarInactiveTintColor: '#94A3B8',
          }}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}
