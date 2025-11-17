import { Doc, Id } from './convex/_generated/dataModel';

export type CreateWarrantyInput = {
  vehicleId: Id<'vehicles'>;
  expiresAt: number;
  manufacturer: string;
  receiptIds: Id<'receipts'>[];
};

export type UpdateWarrantyInput = {
  warrantyId: Id<'warranties'>;
  updates: {
    expiresAt: number;
    manufacturer: string;
    receiptIds?: Id<'receipts'>[];
    receiptIdsToRemove?: Id<'receipts'>[];
  };
};

export type DecodeVinInput = {
  vin: string;
};

export type DecodeVinResult =
  | {
      success: true;
      data: {
        make: string | null;
        model: string | null;
        year: number | null;
        manufacturer: string | null;
        plantCountry: string | null;
        bodyClass: string | null;
        vehicleType: string | null;
        trim: string | null;
        series: string | null;
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
    }
  | {
      success: false;
      error: string;
    };

export type CreateVehicleInput = {
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  vinNumber: string;
  details?: VehicleDetails;
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
    isActive: boolean;
    performed: {
      category: string;
      cost: number;
      name: string;
      notes: string;
      warrantyId: Id<'warranties'>;
      templateItemId: Id<'maintenanceItems'>;
    }[];
    serviceCenter: string;
    serviceDate: number;
    receiptIds: Id<'receipts'>[];
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
    receiptIds?: Id<'receipts'>[];
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
  receiptIds: Id<'receipts'>[];
  receiptIdsToRemove: Id<'receipts'>[];
};

export type InsuranceWithReceipts = {
  insurance: Doc<'insurance'>;
  receipts: Doc<'receipts'>[];
};

export type UpsertInsuranceInput = {
  vehicleId: Id<'vehicles'>;
  expiresAt: number;
  receiptIds: Id<'receipts'>[];
  receiptIdsToRemove: Id<'receipts'>[];
  name: string;
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
