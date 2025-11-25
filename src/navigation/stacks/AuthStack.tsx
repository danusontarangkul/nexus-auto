// src/navigation/stacks/AuthStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AUTH, AuthStackParamList } from '../routes';
import { stackDark } from '../options';
import { Subscribe } from '@/features/auth/screens/Subscribe';

const Stack = createNativeStackNavigator<AuthStackParamList>();
export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={stackDark}>
      <Stack.Screen name={AUTH.Subscribe} component={Subscribe} />
    </Stack.Navigator>
  );
}
