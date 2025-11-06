// src/navigation/options.ts
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const stackDark: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: '#14171C' },
  headerTintColor: '#F8FAFC',
  headerTitleStyle: { color: '#F8FAFC' },
};

export const tabDark = {
  headerStyle: { backgroundColor: '#14171C' },
  headerTintColor: '#F8FAFC',
  tabBarStyle: { backgroundColor: '#14171C', borderTopColor: '#2B313C' },
  tabBarActiveTintColor: '#F8FAFC',
  tabBarInactiveTintColor: '#94A3B8',
};
