import { VehicleData } from '@convex/types';
import { ONBOARD } from './routes';

export type RootStackParamList = {
  [ONBOARD.AddCarStart]: undefined;
  [ONBOARD.VinScan]: undefined;
  Login: undefined;
  [ONBOARD.ConfirmCar]: { car: VehicleData; plate: string; vinNumber: string };
  App: undefined;
  Onboarding: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
