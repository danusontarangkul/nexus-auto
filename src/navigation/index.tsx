// src/navigation/RootNavigator.tsx
import React, { useEffect } from 'react';
import { View } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { ErrorBoundary } from 'react-error-boundary';

import { useAppState } from '../state/AppState';
import { navRef } from './NavRef';
import { ROOT, RootStackParamList } from './routes';
import { AuthStack } from './stacks/AuthStack';
import { OnboardingStack } from './stacks/OnboardingStack';
import { AppTabs } from './tabs/AppTabs';
import DevSwitcher from './dev/DevSwitcher';
import tw from '../styles/tw';

import { DashboardProvider } from '@/providers/DashboardProvider';
import { ErrorFallback } from '@/shared/screens/ErrorFallBack';
import { withErrorBoundary } from '@/shared/hocs/withErrorBoundary';

const Root = createNativeStackNavigator<RootStackParamList>();

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

function Gate() {
  const { isAuthenticated, hasCar } = useAppState();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.reset({ index: 0, routes: [{ name: ROOT.Auth as any }] });
    } else if (!hasCar) {
      navigation.reset({
        index: 0,
        routes: [{ name: ROOT.Onboarding as any }],
      });
    } else {
      navigation.reset({ index: 0, routes: [{ name: ROOT.App as any }] });
    }
  }, [isAuthenticated, hasCar, navigation]);

  return <View style={tw`flex-1 bg-surface-950`} />;
}

export function RootNavigator() {
  return (
    <NavigationContainer ref={navRef} theme={darkNav as any}>
      <ErrorBoundary
        FallbackComponent={(props) => (
          <ErrorFallback {...props} title="Error" />
        )}
      >
        <DashboardProvider>
          <Root.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={ROOT.Gate}
          >
            <Root.Screen name={ROOT.Gate} component={Gate} />

            <Root.Screen
              name={ROOT.Auth}
              component={withErrorBoundary(AuthStack, 'Account Access')}
            />
            <Root.Screen
              name={ROOT.Onboarding}
              component={withErrorBoundary(OnboardingStack, 'Setup')}
            />
            <Root.Screen
              name={ROOT.App}
              component={withErrorBoundary(AppTabs, 'Dashboard')}
            />

            {__DEV__ && <Root.Screen name={ROOT.Dev} component={DevSwitcher} />}
          </Root.Navigator>
        </DashboardProvider>
      </ErrorBoundary>
    </NavigationContainer>
  );
}
