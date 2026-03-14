import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { authTables } from '@convex-dev/auth/server';
import { ReceiptStatus, ReceiptType, ServiceCategory } from './types/literals';

export default defineSchema({
  ...authTables,
  users: defineTable({
    // --- 1. Base Auth Fields (Google puts data here) ---
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),

    // --- 2. Your Custom Fields (Make them optional for the first login!) ---
    lastSelectedVehicleId: v.optional(v.union(v.null(), v.id('vehicles'))),
    appliedPromoCode: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    hasPaid: v.optional(v.boolean()),
    promoCodeAppliedAt: v.optional(v.number()),
    revenueCatId: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
  })
    .index('email', ['email'])
    .index('by_revenue_cat_id', ['revenueCatId']),

  insurance: defineTable({
    expiresAt: v.number(),
    providerName: v.string(),
    updatedAt: v.number(),
    vehicleId: v.id('vehicles'),
  }).index('by_vehicle', ['vehicleId']),

  maintenanceItems: defineTable({
    vehicleId: v.id('vehicles'),
    serviceName: v.string(),
    category: ServiceCategory,
    intervalMiles: v.optional(v.number()),
    intervalMonths: v.optional(v.number()),
    lastDoneAtMileage: v.optional(v.number()),
    lastDoneAtDate: v.optional(v.number()),
    lastDoneRecordId: v.optional(v.id('serviceRecords')),
    nextDueMileage: v.optional(v.number()),
    nextDueDate: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index('by_vehicle', ['vehicleId'])
    .index('by_next_due_miles', ['vehicleId', 'nextDueMileage'])
    .index('by_next_due_date', ['vehicleId', 'nextDueDate']),

  serviceRecords: defineTable({
    isActive: v.boolean(),
    mileage: v.number(),
    performed: v.array(
      v.object({
        category: ServiceCategory,
        serviceName: v.string(),
        notes: v.optional(v.string()),
        warrantyId: v.optional(v.id('warranties')),
        templateItemId: v.optional(v.id('maintenanceItems')),
      }),
    ),
    serviceCenter: v.union(v.null(), v.string()),
    serviceDate: v.number(),
    updatedAt: v.number(),
    vehicleId: v.id('vehicles'),
  }).index('by_vehicle', ['vehicleId']),

  receipts: defineTable({
    storageId: v.id('_storage'),
    insuranceId: v.optional(v.id('insurance')),
    serviceRecordId: v.optional(v.id('serviceRecords')),
    registrationId: v.optional(v.id('registrations')),
    updatedAt: v.number(),
    userId: v.id('users'),
    warrantyId: v.optional(v.id('warranties')),
    type: ReceiptType,
    isActive: v.boolean(),
  })
    .index('by_insurance', ['insuranceId'])
    .index('by_serviceRecord', ['serviceRecordId'])
    .index('by_registration', ['registrationId'])
    .index('by_warranty', ['warrantyId'])
    .index('by_user', ['userId']),

  registrations: defineTable({
    expiresAt: v.number(),
    updatedAt: v.number(),
    vehicleId: v.id('vehicles'),
  }).index('by_vehicle', ['vehicleId']),

  vehicles: defineTable({
    isActive: v.boolean(),
    licensePlate: v.string(),
    updatedAt: v.number(),
    userId: v.id('users'),
    vehicleData: v.object({
      bodyClass: v.union(v.string(), v.null()),
      doors: v.union(v.number(), v.null()),
      driveType: v.union(v.string(), v.null()),
      engine: v.object({
        cylinders: v.union(v.number(), v.null()),
        displacement: v.union(v.number(), v.null()),
        fuelType: v.union(v.string(), v.null()),
        horsepower: v.union(v.number(), v.null()),
      }),
      fuelType: v.union(v.string(), v.null()),
      gvwr: v.union(v.string(), v.null()),
      make: v.union(v.string(), v.null()),
      manufacturer: v.union(v.string(), v.null()),
      model: v.union(v.string(), v.null()),
      plantCountry: v.union(v.string(), v.null()),
      series: v.union(v.string(), v.null()),
      transmission: v.union(v.string(), v.null()),
      trim: v.union(v.string(), v.null()),
      vehicleType: v.union(v.string(), v.null()),
      year: v.union(v.number(), v.null()),
    }),
    vinNumber: v.string(),
  }).index('by_user', ['userId']),

  warranties: defineTable({
    expiresAt: v.number(),
    isActive: v.boolean(),
    manufacturer: v.string(),
    component: v.string(),
    updatedAt: v.number(),
    vehicleId: v.id('vehicles'),
  }).index('by_vehicle', ['vehicleId']),
});
