import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ErrorBoundary } from 'react-error-boundary';

import { navRef } from './NavRef';
import { ROOT, RootStackParamList } from './routes';
import { AuthStack } from './stacks/AuthStack';
import { OnboardingStack } from './stacks/OnboardingStack';
import { AppTabs } from './tabs/AppTabs';
import { Gate } from './Gate';
import DevSwitcher from './dev/DevSwitcher';

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

function AuthenticatedApp() {
  return (
    <DashboardProvider>
      <AppTabs />
    </DashboardProvider>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer ref={navRef} theme={darkNav as any}>
      <ErrorBoundary
        FallbackComponent={(props) => (
          <ErrorFallback {...props} title="Error" />
        )}
      >
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
            component={withErrorBoundary(AuthenticatedApp, 'Dashboard')}
          />

          {__DEV__ && <Root.Screen name={ROOT.Dev} component={DevSwitcher} />}
        </Root.Navigator>
      </ErrorBoundary>
    </NavigationContainer>
  );
}
