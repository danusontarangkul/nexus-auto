import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ErrorBoundary } from 'react-error-boundary';
import { navRef } from './NavRef';
import { ROOT, RootStackParamList } from './routes';
import { AuthStack } from './stacks/AuthStack';
import { OnboardingStack } from './stacks/OnboardingStack';
import { AuthenticatedApp } from './AuthenticatedApp';
import { ErrorFallback } from '@/shared/screens/ErrorFallBack';
import { withErrorBoundary } from '@/shared/hocs/withErrorBoundary';
import { FullScreenLoading } from '@/shared/screens/FullScreenLoading';
import { darkNavTheme } from '@/styles/theme';
import { useInitialBoot } from './hooks/useInitialBoot';
import DevSwitcher from './dev/DevSwitcher';

const Root = createNativeStackNavigator<RootStackParamList>();

const devSwitcherScreen = __DEV__ ? (
  <Root.Screen
    name={ROOT.Dev}
    component={withErrorBoundary(DevSwitcher, 'Developer Tools')}
  />
) : null;

export function RootNavigator() {
  const { isAuthenticated, hasCar, isLoading } = useInitialBoot();

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <NavigationContainer ref={navRef} theme={darkNavTheme}>
      <ErrorBoundary
        FallbackComponent={(errorProps) => (
          <ErrorFallback
            error={errorProps.error}
            resetErrorBoundary={errorProps.resetErrorBoundary}
            title="System Error"
          />
        )}
      >
        {!isAuthenticated ? (
          <Root.Navigator screenOptions={{ headerShown: false }}>
            <Root.Screen
              name={ROOT.Auth}
              component={withErrorBoundary(AuthStack, 'Account Access')}
            />
            {devSwitcherScreen}
          </Root.Navigator>
        ) : !hasCar ? (
          <Root.Navigator screenOptions={{ headerShown: false }}>
            <Root.Screen
              name={ROOT.Onboarding}
              component={withErrorBoundary(OnboardingStack, 'Vehicle Setup')}
            />
            {devSwitcherScreen}
          </Root.Navigator>
        ) : (
          <Root.Navigator
            initialRouteName={ROOT.App}
            screenOptions={{ headerShown: false }}
          >
            <Root.Screen
              name={ROOT.App}
              component={withErrorBoundary(AuthenticatedApp, 'Dashboard')}
            />
            <Root.Screen
              name={ROOT.Onboarding}
              component={withErrorBoundary(OnboardingStack, 'Vehicle Setup')}
            />
            {devSwitcherScreen}
          </Root.Navigator>
        )}
      </ErrorBoundary>
    </NavigationContainer>
  );
}
