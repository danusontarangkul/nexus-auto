import { RouteProp, useRoute } from '@react-navigation/native';
import { DashboardStackParamList, DASHBOARD } from '@/navigation/routes';

export const useInsuranceRouteParams = () => {
  const route =
    useRoute<RouteProp<DashboardStackParamList, typeof DASHBOARD.Insurance>>();
  return route.params;
};
