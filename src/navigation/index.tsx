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

type ActiveStack = {
  name: keyof RootStackParamList;
  component: React.ComponentType<any>;
  title: string;
};

export function RootNavigator() {
  const { isAuthenticated, hasCar, isLoading } = useInitialBoot();

  if (isLoading) {
    return <FullScreenLoading />;
  }

  const getActiveStack = (): ActiveStack => {
    if (!isAuthenticated) {
      return {
        name: ROOT.Auth,
        component: AuthStack,
        title: 'Account Access',
      };
    }

    if (!hasCar) {
      return {
        name: ROOT.Onboarding,
        component: OnboardingStack,
        title: 'Vehicle Setup',
      };
    }

    return {
      name: ROOT.App,
      component: AuthenticatedApp,
      title: 'Dashboard',
    };
  };

  const active = getActiveStack();

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
        <Root.Navigator screenOptions={{ headerShown: false }}>
          <Root.Screen
            key={active.name}
            name={active.name}
            component={withErrorBoundary(active.component, active.title)}
          />

          {__DEV__ && (
            <Root.Screen
              name={ROOT.Dev}
              component={withErrorBoundary(DevSwitcher, 'Developer Tools')}
            />
          )}
        </Root.Navigator>
      </ErrorBoundary>
    </NavigationContainer>
  );
}
