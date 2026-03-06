import React from 'react';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TABS, AppTabsParamList } from './routes';
import { RouteProp } from '@react-navigation/native';
import tw from '@/styles/tw';

export const stackDark: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: tw.color('surface-950') },
  headerTintColor: tw.color('ink-900'),
  headerTitleStyle: { color: tw.color('ink-900') },
};

export const tabDark: BottomTabNavigationOptions = {
  headerShown: true,
  headerTitle: '',
  headerStyle: {
    backgroundColor: tw.color('surface-950'),
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: tw.color('ink-900'),
  tabBarStyle: {
    backgroundColor: '#000000',
    borderTopColor: '#000000',
    height: 90,
    paddingBottom: 30,
  },
  tabBarActiveTintColor: tw.color('primary-500'),
  tabBarInactiveTintColor: tw.color('ink-900'),
};

export const getTabBarIcon = (
  route: RouteProp<AppTabsParamList, keyof AppTabsParamList>,
  focused: boolean,
  color: string,
  size: number,
) => {
  let iconName: keyof typeof Ionicons.glyphMap;

  switch (route.name) {
    case TABS.Dashboard:
      iconName = focused ? 'home' : 'home-outline';
      break;
    case TABS.Records:
      iconName = focused ? 'time' : 'time-outline';
      break;
    case TABS.Warranties:
      iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
      break;
    case TABS.About:
      iconName = focused ? 'car' : 'car-outline';
      break;
    default:
      iconName = 'help-circle-outline';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};
