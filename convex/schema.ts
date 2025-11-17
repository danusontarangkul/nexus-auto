import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { ReceiptStatus, ReceiptType } from "./types/literals";

export default defineSchema({
  insurance: defineTable({
    expiresAt: v.number(),
    name: v.string(),
    updatedAt: v.number(),
    vehicleId: v.id("vehicles"),
  }).index("by_vehicle", ["vehicleId"]),
  maintenanceItems: defineTable({
    vehicleId: v.id("vehicles"),
    name: v.string(),
    category: v.string(),
    intervalMiles: v.optional(v.number()),
    intervalMonths: v.optional(v.number()),
    lastDoneAtMileage: v.optional(v.number()),
    lastDoneAtDate: v.optional(v.number()),
    lastDoneRecordId: v.optional(v.id("serviceRecords")),
    nextDueMileage: v.optional(v.number()),
    nextDueDate: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_vehicle", ["vehicleId"])
    .index("by_next_due_miles", ["vehicleId", "nextDueMileage"])
    .index("by_next_due_date", ["vehicleId", "nextDueDate"]),
  maintenanceTemplates: defineTable({
    make: v.string(),
    model: v.string(),
    yearStart: v.number(),
    yearEnd: v.number(),
    trim: v.optional(v.string()),
    engine: v.optional(v.string()),
    source: v.union(v.literal("seeded"), v.literal("ai-generated")),
    generatedAt: v.optional(v.number()),
    defaultItems: v.array(
      v.object({
        name: v.string(),
        category: v.string(),
        intervalMiles: v.optional(v.number()),
        intervalMonths: v.optional(v.number()),
        severity: v.optional(v.union(v.literal("normal"), v.literal("severe"))),
        estimatedCostUsd: v.optional(v.number()),
        notes: v.optional(v.string()),
      })
    ),
  })
    .index("by_make_model_year", ["make", "model", "yearStart"])
    .index("by_make", ["make"])
    .index("by_model", ["model"]),

  serviceRecords: defineTable({
    isActive: v.boolean(),
    performed: v.array(
      v.object({
        category: v.string(),
        cost: v.union(v.null(), v.number()),
        name: v.string(),
        notes: v.union(v.null(), v.string()),
        warrantyId: v.optional(v.id("warranties")),
        templateItemId: v.optional(v.id("maintenanceItems")),
      })
    ),
    serviceCenter: v.union(v.null(), v.string()),
    serviceDate: v.number(),
    updatedAt: v.number(),
    vehicleId: v.id("vehicles"),
  }).index("by_vehicle", ["vehicleId"]),
  receipts: defineTable({
    fileId: v.id("_storage"),
    fileName: v.string(),
    insuranceId: v.optional(v.id("insurance")),
    parsedData: v.optional(v.any()),
    serviceRecordId: v.optional(v.id("serviceRecords")),
    registrationId: v.optional(v.id("registrations")),
    status: ReceiptStatus,
    updatedAt: v.number(),
    uploadedAt: v.number(),
    url: v.string(),
    userId: v.id("users"),
    warrantyId: v.optional(v.id("warranties")),
    type: ReceiptType,
  })
    .index("by_insurance", ["insuranceId"])
    .index("by_serviceRecord", ["serviceRecordId"])
    .index("by_registration", ["registrationId"])
    .index("by_warranty", ["warrantyId"])
    .index("by_user", ["userId"]),
  registrations: defineTable({
    expiresAt: v.number(),
    updatedAt: v.number(),
    vehicleId: v.id("vehicles"),
  }).index("by_vehicle", ["vehicleId"]),

  users: defineTable({
    appliedPromoCode: v.optional(v.string()),
    email: v.string(),
    expiresAt: v.number(),
    hasPaid: v.boolean(),
    promoCodeAppliedAt: v.optional(v.number()),
    revenueCatId: v.string(),
    updatedAt: v.number(),
  }).index("by_revenue_cat_id", ["revenueCatId"]),
  vehicles: defineTable({
    isActive: v.boolean(),
    licensePlate: v.string(),
    make: v.string(),
    model: v.string(),
    updatedAt: v.number(),
    userId: v.id("users"),
    vinNumber: v.string(),
    year: v.number(),
    details: v.optional(
      v.object({
        bodyClass: v.optional(v.string()),
        driveType: v.optional(v.string()),
        engineDisplacement: v.optional(v.string()),
        gvwr: v.optional(v.string()),
        manufacturer: v.optional(v.string()),
        plantCity: v.optional(v.string()),
        plantCountry: v.optional(v.string()),
        fuelType: v.optional(v.string()),
        trim: v.optional(v.string()),
        transmission: v.optional(v.string()),
        safetyFeatures: v.optional(
          v.object({
            airbagsFront: v.optional(v.string()),
            airbagsSide: v.optional(v.string()),
            abs: v.optional(v.string()),
            seatBelts: v.optional(v.string()),
            tractionControl: v.optional(v.string()),
          })
        ),
      })
    ),
  }).index("by_user", ["userId"]),
  warranties: defineTable({
    expiresAt: v.number(),
    isActive: v.boolean(),
    manufacturer: v.string(),
    updatedAt: v.number(),
    vehicleId: v.id("vehicles"),
  }).index("by_vehicle", ["vehicleId"]),
});
