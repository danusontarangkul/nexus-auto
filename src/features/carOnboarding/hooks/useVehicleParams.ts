import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import { getVehicleWithFallbacks } from '../utils/vehicle';

export function useVehicleParams() {
  const route = useRoute<RouteProp<RootStackParamList, 'ConfirmCar'>>();

  return getVehicleWithFallbacks(
    route.params?.car,
    route.params?.plate,
    route.params?.vinNumber,
  );
}
