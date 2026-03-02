import { v } from 'convex/values';

export const vehicleDataValidator = v.object({
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
});
