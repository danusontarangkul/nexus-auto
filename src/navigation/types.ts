import { ONBOARD } from './routes';

export type RootStackParamList = {
  [ONBOARD.AddCarStart]: undefined;
  [ONBOARD.VinScan]: undefined;
  Login: undefined;
  ConfirmCar: undefined;
  App: undefined;
  Onboarding: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
