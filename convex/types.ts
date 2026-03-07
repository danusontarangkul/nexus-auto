import { Doc, Id } from './_generated/dataModel';

export type CreateWarrantyInput = {
  vehicleId: Id<'vehicles'>;
  expiresAt: number;
  manufacturer: string;
  titleOfManufacturer: string;
  storageIds: Id<'_storage'>[];
};

export type UpdateWarrantyInput = {
  warrantyId: Id<'warranties'>;
  updates: {
    expiresAt: number;
    manufacturer: string;
    titleOfManufacturer: string;
    storageIds?: Id<'_storage'>[];
    receiptIdsToRemove?: Id<'receipts'>[];
  };
};

export type DecodeVinInput = {
  vin: string;
};

export type VehicleData = {
  make: string | null;
  model: string | null;
  year: number | null;
  manufacturer: string | null;
  plantCountry: string | null;
  bodyClass: string | null;
  vehicleType: string | null;
  trim: string | null;
  series: string | null;
  fuelType: string | null;
  engine: {
    displacement: number | null;
    cylinders: number | null;
    horsepower: number | null;
    fuelType: string | null;
  };
  gvwr: string | null;
  doors: number | null;
  driveType: string | null;
  transmission: string | null;
};
export type CreateVehicleInput = {
  licensePlate: string;
  vinNumber: string;
  vehicleData: VehicleData;
};

export type VehicleDetails = {
  bodyClass: string;
  driveType: string;
  engineDisplacement: string;
  gvwr: string;
  manufacturer: string;
  plantCity: string;
  plantCountry: string;
  fuelType: string;
  trim: string;
  transmission: string;
  safetyFeatures?: SafetyFeatures;
};

export type SafetyFeatures = {
  airbagsFront: string;
  airbagsSide: string;
  abs: string;
  seatBelts: string;
  tractionControl: string;
};

export type UpdateVehicleInput = {
  vehicleId: Id<'vehicles'>;
  updates: {
    isActive?: boolean;
    licensePlate?: string;
    make?: string;
    model?: string;
    year?: number;
    vinNumber?: string;
    details?: VehicleDetails;
  };
};

export type ServiceRecordWithReceipts = {
  serviceRecord: Doc<'serviceRecords'>;
  receipts: Doc<'receipts'>[];
};

export type CreateServiceRecordInput = {
  vehicleId: Id<'vehicles'>;
  serviceRecord: {
    performed: {
      category: string;
      cost: number;
      name: string;
      notes: string;
      warrantyId?: Id<'warranties'>;
      templateItemId?: Id<'maintenanceItems'>;
    }[];
    serviceCenter: string;
    serviceDate: number;
    storageIds: Id<'_storage'>[];
  };
};

export type UpdateServiceRecordInput = {
  serviceRecordId: Id<'serviceRecords'>;
  updates: {
    isActive?: boolean;
    performed?: {
      category: string;
      cost: number;
      name: string;
      notes: string;
      warrantyId: Id<'warranties'>;
      templateItemId: Id<'maintenanceItems'>;
    }[];
    serviceCenter?: string;
    serviceDate?: number;
    storageIds?: Id<'_storage'>[];
    receiptIdsToRemove?: Id<'receipts'>[];
  };
};

export type RegistrationWithReceipts = {
  registration: Doc<'registrations'> | null;
  receipts: Doc<'receipts'>[];
};

export type UpsertRegistrationInput = {
  vehicleId: Id<'vehicles'>;
  expiresAt: number;
  newReceiptStorageIds: Id<'_storage'>[];
  receiptIdsToRemove: Id<'receipts'>[];
};

export type InsuranceWithReceipts = {
  insurance: Doc<'insurance'> | null;
  receipts: Doc<'receipts'>[];
};

export type UpsertInsuranceInput = {
  vehicleId: Id<'vehicles'>;
  expiresAt: number;
  newReceiptStorageIds: Id<'_storage'>[];
  receiptIdsToRemove: Id<'receipts'>[];
  providerName: string;
};

export type CreateReceiptInput = {
  vehicleId: Id<'vehicles'>;
  file: File;
  fileName: string;
  type: ReceiptType;
};

export type ReceiptType =
  | 'registration'
  | 'insurance'
  | 'warranty'
  | 'serviceRecord';

export type ValidatePromoCodeInput = {
  promoCode: string;
};

export type StartYearlySubscriptionInput = {
  promoCode: string;
};

export type StartYearlySubscriptionResult = {
  success: boolean;
  message?: string;
  appUserId: string;
  offeredPromoCode?: string;
};

export type CheckOrRestoreSubscriptionInput = {
  revenueCatAppUserId: string;
};

export type CheckOrRestoreSubscriptionResult =
  | {
      success: true;
      hasActiveSubscription: boolean;
      expiresAt?: number;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

export type InsertReceiptResponse = {
  receiptId: Id<'receipts'>;
  url: string;
  status: ReceiptStatus;
};

export type ReceiptStatus =
  | 'draft'
  | 'parsing'
  | 'ready'
  | 'parsed'
  | 'failed'
  | 'abandoned';

export type WarrantyWithReceipts = {
  warranty: Doc<'warranties'>;
  receipts: Doc<'receipts'>[];
};

export interface NhtsaRawVehicle {
  Make: string | null;
  Model: string | null;
  ModelYear: string | null;
  Manufacturer: string | null;
  PlantCountry: string | null;
  BodyClass: string | null;
  VehicleType: string | null;
  Trim: string | null;
  Series: string | null;
  DisplacementL: string | null;
  EngineCylinders: string | null;
  EngineHP: string | null;
  FuelTypePrimary: string | null;
  GVWR: string | null;
  Doors: string | null;
  DriveType: string | null;
  TransmissionStyle: string | null;
  ErrorCode: string;
}

export interface VehicleListItem {
  _id: Id<'vehicles'>;
  year: number | null;
  make: string | null;
  model: string | null;
}

export interface Dashboard {
  vehicles: VehicleListItem[];
  active: {
    vehicle: Doc<'vehicles'>;
    registration: Doc<'registrations'> | null;
    insurance: Doc<'insurance'> | null;
    maintenanceItems: Doc<'maintenanceItems'>[];
  } | null;
}

export interface CategoryOption {
  label: string;
  value: string;
}
