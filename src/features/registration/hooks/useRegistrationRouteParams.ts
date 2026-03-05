import { RouteProp, useRoute } from '@react-navigation/native';
import { DashboardStackParamList, DASHBOARD } from '@/navigation/routes';

export const useRegistrationRouteParams = () => {
  const route =
    useRoute<
      RouteProp<DashboardStackParamList, typeof DASHBOARD.Registration>
    >();
  return route.params;
};
