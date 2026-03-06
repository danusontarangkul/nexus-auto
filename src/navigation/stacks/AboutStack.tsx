import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackDark } from '../options';
import { ABOUT, AboutStackParamList } from '../routes';
import { AboutScreen } from '@/features/about/screens/AboutScreen';

const Stack = createNativeStackNavigator<AboutStackParamList>();

export function AboutStack() {
  return (
    <Stack.Navigator screenOptions={stackDark}>
      <Stack.Screen
        name={ABOUT.About}
        component={AboutScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
