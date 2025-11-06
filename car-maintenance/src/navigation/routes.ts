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
  Login: 'Login',
  Register: 'Register',
} as const;

export type AuthStackParamList = {
  [AUTH.Login]: undefined;
  [AUTH.Register]: undefined;
};

export const ONBOARD = {
  AddCarStart: 'AddCarStart',
  EnterVIN: 'EnterVIN',
  EnterManual: 'EnterManual',
  UploadVINPhoto: 'UploadVINPhoto',
  ConfirmCar: 'ConfirmCar',
} as const;

export type OnboardingStackParamList = {
  [ONBOARD.AddCarStart]: undefined;
  [ONBOARD.EnterVIN]: undefined;
  [ONBOARD.EnterManual]: undefined;
  [ONBOARD.UploadVINPhoto]: undefined;
  [ONBOARD.ConfirmCar]: undefined;
};

export const TABS = {
  Dashboard: 'Dashboard',
} as const;

export type AppTabsParamList = {
  [TABS.Dashboard]: undefined;
};
