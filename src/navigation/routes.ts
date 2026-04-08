import { Id } from '@convex/_generated/dataModel';
import { VehicleData } from '@convex/types';
import type { NavigatorScreenParams } from '@react-navigation/native';

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
  [ROOT.App]: NavigatorScreenParams<AppTabsParamList> | undefined;
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
  [TABS.Dashboard]: NavigatorScreenParams<DashboardStackParamList> | undefined;
  [TABS.Records]: NavigatorScreenParams<RecordsStackParamList>;
  [TABS.Warranties]: undefined;
  [TABS.About]: NavigatorScreenParams<AboutStackParamList>;
};

export const DASHBOARD = {
  DashboardMain: 'DashboardMain',
  Account: 'Account',
  Registration: 'Registration',
  Insurance: 'Insurance',
  ServiceRecordDetails: 'ServiceRecordDetails',
} as const;

export type DashboardStackParamList = {
  [DASHBOARD.DashboardMain]: undefined;
  [DASHBOARD.Registration]: { vehicleId: Id<'vehicles'> };
  [DASHBOARD.Insurance]: { vehicleId: Id<'vehicles'> };
  [DASHBOARD.Account]: undefined;
  [DASHBOARD.ServiceRecordDetails]: { recordId: Id<'serviceRecords'> };
};

export const RECORDS = {
  RecordsList: 'RecordsList',
  RecordDetails: 'RecordDetails',
  AddRecord: 'AddRecord',
} as const;

export type RecordsStackParamList = {
  [RECORDS.RecordsList]: undefined;
  [RECORDS.AddRecord]: { initialMaintenanceItemId?: Id<'maintenanceItems'> };
  [RECORDS.RecordDetails]: { recordId: Id<'serviceRecords'> };
};

export const WARRANTIES = {
  WarrantiesList: 'WarrantiesList',
  AddWarranty: 'AddWarranty',
  WarrantyDetails: 'WarrantyDetails',
} as const;

export type WarrantiesStackParamList = {
  [WARRANTIES.WarrantiesList]: undefined;
  [WARRANTIES.AddWarranty]: undefined;
  [WARRANTIES.WarrantyDetails]: { warrantyId: Id<'warranties'> };
};

export const ABOUT = {
  AboutMain: 'AboutMain',
} as const;

export type AboutStackParamList = {
  [ABOUT.AboutMain]: undefined;
};
