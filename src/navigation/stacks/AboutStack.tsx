import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stackDark } from '../options';
import { ABOUT, AboutStackParamList } from '../routes';
import { AboutScreen } from '@/features/about/screens/AboutScreen';
import { BackHeader } from '../components/BackHeader';

const Stack = createNativeStackNavigator<AboutStackParamList>();

export function AboutStack() {
  return (
    <Stack.Navigator screenOptions={stackDark}>
      <Stack.Screen
        name={ABOUT.AboutMain}
        component={AboutScreen}
        options={{
          header: () => <BackHeader title="About" hideBack={true} />,
        }}
      />
    </Stack.Navigator>
  );
}
