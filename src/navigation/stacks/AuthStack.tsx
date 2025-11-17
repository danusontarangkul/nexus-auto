// src/navigation/stacks/AuthStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AUTH, AuthStackParamList } from '../routes';
import { stackDark } from '../options';
import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../../features/auth/screens/RegisterScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();
export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={stackDark}>
      <Stack.Screen name={AUTH.Login} component={LoginScreen} />
      <Stack.Screen name={AUTH.Register} component={RegisterScreen} />
    </Stack.Navigator>
  );
}
