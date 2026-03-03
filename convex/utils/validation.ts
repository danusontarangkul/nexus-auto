import { ConvexError } from 'convex/values';
import { Doc, Id } from '../_generated/dataModel';
import { throwDomainError } from './errors';

export const validateWarranty = (
  warranty: Doc<'warranties'> | null,
): Doc<'warranties'> => {
  if (!warranty) {
    throw new ConvexError({ code: 'not_found', message: 'Warranty not found' });
  }

  return warranty;
};

export const validateReceipt = (
  receipt: Doc<'receipts'> | null,
): Doc<'receipts'> => {
  if (!receipt) {
    throw new ConvexError({ code: 'not_found', message: 'Receipt not found' });
  }
  return receipt;
};

export const validateVehicle = (
  vehicle: Doc<'vehicles'> | null,
): Doc<'vehicles'> => {
  if (!vehicle) {
    throwDomainError('validateVehicle', 'Vehicle not found');
  }
  if (vehicle.isActive === false) {
    throwDomainError('validateVehicle', 'Vehicle is not active');
  }
  return vehicle;
};

export const validateUser = (user: Doc<'users'> | null): Doc<'users'> => {
  if (!user) {
    throw new ConvexError({ code: 'not_found', message: 'User not found' });
  }
  if (!user.hasPaid) {
    throw new Error('test');
    // throw new ConvexError({
    //   code: "subscription_ended",
    //   message: "Subscription has ended for user.",
    // });
  }
  return user;
};

export const validateServiceRecord = (
  serviceRecord: Doc<'serviceRecords'> | null,
): Doc<'serviceRecords'> => {
  if (!serviceRecord) {
    throw new ConvexError({
      code: 'not_found',
      message: 'Service record not found',
    });
  }
  return serviceRecord;
};

export const isIdentityOwnerOfVehicle = (
  identityUserId: string,
  userId: Id<'vehicles'>,
): void => {
  if (identityUserId !== (userId as string)) {
    throw new ConvexError({
      code: 'forbidden',
      message: 'You are not the owner of this vehicle',
    });
  }
};

export const isUserOwnerOfVehicle = (
  userId: Id<'users'>,
  vehicleId: Doc<'vehicles'>,
): void => {
  if (userId !== vehicleId.userId) {
    throwDomainError('isUserOwnerOfVehicle', 'Vehicle not found');
  }
};

export const validateInsurance = (
  insurance: Doc<'insurance'> | null,
): Doc<'insurance'> => {
  if (!insurance) {
    throw new ConvexError({
      code: 'not_found',
      message: 'Insurance not found',
    });
  }
  return insurance;
};
