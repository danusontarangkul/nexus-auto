export const ROOT = {
  Gate: 'Gate',
  Auth: 'Auth',
  Onboarding: 'Onboarding',
  App: 'App',
  Dev: '__DEV__',
} as const;

export type RootStackParamList = {
  [ROOT.Gate]: undefined;
  [ROOT.Auth]: undefined;
  [ROOT.Onboarding]: undefined;
  [ROOT.App]: undefined;
  [ROOT.Dev]?: undefined;
};

export const AUTH = {
  Subscribe: 'Subscribe',
} as const;

export type AuthStackParamList = {
  [AUTH.Subscribe]: undefined;
};

// ✅ keep names 1:1 with what you register in the stack
export const ONBOARD = {
  AddCarStart: 'AddCarStart',
  EnterVin: 'EnterVin', // manual VIN input screen
  EnterManual: 'EnterManual', // full manual entry details screen
  VinScan: 'VinScan', // camera scanning screen
  UploadVINPhoto: 'UploadVINPhoto',
  ConfirmCar: 'ConfirmCar',
} as const;

export type OnboardingStackParamList = {
  [ONBOARD.AddCarStart]: undefined;
  [ONBOARD.EnterVin]: undefined;
  [ONBOARD.EnterManual]: undefined;
  [ONBOARD.VinScan]: undefined;
  [ONBOARD.UploadVINPhoto]: undefined;
  [ONBOARD.ConfirmCar]: undefined;
};

export const TABS = {
  Dashboard: 'Dashboard',
} as const;

export type AppTabsParamList = {
  [TABS.Dashboard]: undefined;
};
