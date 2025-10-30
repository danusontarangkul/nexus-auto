import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  insurances: defineTable({
    expiresAt: v.number(),
    isActive: v.boolean(),
    name: v.string(),
    photoStorageIds: v.optional(v.array(v.id("_storage"))),
    updatedAt: v.number(),
    vehicleId: v.id("vehicles"),
  }),
  records: defineTable({
    documents: v.optional(v.array(v.string())),
    isActive: v.boolean(),
    performed: v.array(
      v.object({
        category: v.string(),
        cost: v.union(v.null(), v.number()),
        name: v.string(),
        notes: v.union(v.null(), v.string()),
        warrantyId: v.optional(v.id("warranties")),
      })
    ),
    serviceCenter: v.union(v.null(), v.string()),
    serviceDate: v.number(),
    updatedAt: v.number(),
    userId: v.id("users"),
    vehicleId: v.id("vehicles"),
  }),
  registrations: defineTable({
    expiresAt: v.number(),
    isActive: v.boolean(),
    name: v.string(),
    photoStorageIds: v.optional(v.array(v.id("_storage"))),
    updatedAt: v.number(),
    vehicleId: v.id("vehicles"),
  }),
  subscriptions: defineTable({
    expiresAt: v.number(),
    isActive: v.boolean(),
    startedAt: v.number(),
    updatedAt: v.number(),
    userId: v.id("users"),
  }),
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    isActive: v.boolean(),
    name: v.string(),
    photoUrl: v.union(v.null(), v.string()),
    updatedAt: v.number(),
  }),
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
  }),
  warranties: defineTable({
    expiresAt: v.number(),
    isActive: v.boolean(),
    manufacturer: v.string(),
    photoStorageIds: v.optional(v.array(v.id("_storage"))),
    updatedAt: v.number(),
    vehicleId: v.id("vehicles"),
  }),
});
