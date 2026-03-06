import { Id } from '@convex/_generated/dataModel';
import { VehicleData } from '@convex/types';

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
  Login: 'Login',
} as const;

export type AuthStackParamList = {
  [AUTH.Subscribe]: undefined;
  [AUTH.Login]: undefined;
};

export const ONBOARD = {
  AddCarStart: 'AddCarStart',
  EnterVin: 'EnterVin',
  EnterManual: 'EnterManual',
  VinScan: 'VinScan',
  UploadVINPhoto: 'UploadVINPhoto',
  ConfirmCar: 'ConfirmCar',
} as const;

export type OnboardingStackParamList = {
  [ONBOARD.AddCarStart]: undefined;
  [ONBOARD.EnterVin]: undefined;
  [ONBOARD.EnterManual]: undefined;
  [ONBOARD.VinScan]: undefined;
  [ONBOARD.UploadVINPhoto]: undefined;
  [ONBOARD.ConfirmCar]: { car: VehicleData; plate: string; vinNumber: string };
};

export const TABS = {
  Dashboard: 'Dashboard',
  Records: 'Records',
  Warranties: 'Warranties',
  About: 'About',
} as const;

export type AppTabsParamList = {
  [TABS.Dashboard]: undefined;
  [TABS.Records]: undefined;
  [TABS.Warranties]: undefined;
  [TABS.About]: undefined;
};

export const DASHBOARD = {
  DashboardMain: 'DashboardMain',
  Registration: 'Registration',
  Insurance: 'Insurance',
} as const;

export type DashboardStackParamList = {
  [DASHBOARD.DashboardMain]: undefined;
  [DASHBOARD.Registration]: { vehicleId: Id<'vehicles'> };
  [DASHBOARD.Insurance]: { vehicleId: Id<'vehicles'> };
};

export const RECORDS = {
  Records: 'Records',
} as const;

export type RecordsStackParamList = {
  [RECORDS.Records]: undefined;
};

export const WARRANTIES = {
  Warranties: 'Warranties',
} as const;

export type WarrantiesStackParamList = {
  [WARRANTIES.Warranties]: undefined;
};

export const ABOUT = {
  About: 'About',
} as const;

export type AboutStackParamList = {
  [ABOUT.About]: undefined;
};
