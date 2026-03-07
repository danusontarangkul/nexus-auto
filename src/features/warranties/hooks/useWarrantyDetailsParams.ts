import { useRoute, RouteProp } from '@react-navigation/native';
import { WarrantiesStackParamList, WARRANTIES } from '@/navigation/routes';

export const useWarrantyDetailsParams = () => {
  const route =
    useRoute<
      RouteProp<WarrantiesStackParamList, typeof WARRANTIES.WarrantyDetails>
    >();

  return route.params;
};
