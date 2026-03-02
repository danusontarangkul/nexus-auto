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
import { useAppState } from '../state/AppState';
import { navRef } from './NavRef';
import { ROOT, RootStackParamList } from './routes';
import { AuthStack } from './stacks/AuthStack';
import { OnboardingStack } from './stacks/OnboardingStack';
import { AppTabs } from './tabs/AppTabs';
import DevSwitcher from './dev/DevSwitcher';
import tw from '../styles/tw';

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
      navigation.reset({ index: 0, routes: [{ name: ROOT.Auth as never }] });
    } else if (!hasCar) {
      navigation.reset({
        index: 0,
        routes: [{ name: ROOT.Onboarding as never }],
      });
    } else {
      navigation.reset({ index: 0, routes: [{ name: ROOT.App as never }] });
    }
  }, [isAuthenticated, hasCar, navigation]);

  return <View style={tw`flex-1 bg-surface-950`} />;
}

export function RootNavigator() {
  return (
    <NavigationContainer ref={navRef} theme={darkNav as any}>
      <Root.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={ROOT.Gate}
      >
        <Root.Screen name={ROOT.Gate} component={Gate} />
        <Root.Screen name={ROOT.Auth} component={AuthStack} />
        <Root.Screen name={ROOT.Onboarding} component={OnboardingStack} />
        <Root.Screen name={ROOT.App} component={AppTabs} />
        {__DEV__ && <Root.Screen name={ROOT.Dev} component={DevSwitcher} />}
      </Root.Navigator>
    </NavigationContainer>
  );
}
