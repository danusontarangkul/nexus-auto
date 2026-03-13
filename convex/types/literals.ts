import { v } from 'convex/values';

export const ReceiptStatus = v.union(
  v.literal('draft'),
  v.literal('parsing'),
  v.literal('ready'),
  v.literal('parsed'),
  v.literal('failed'),
  v.literal('abandoned'),
);

export const ReceiptType = v.union(
  v.literal('insurance'),
  v.literal('registration'),
  v.literal('warranty'),
  v.literal('serviceRecord'),
);

export const ServiceCategoryValues = [
  'routine',
  'fluids_filters',
  'tires_brakes',
  'electrical',
  'engine_drive',
  'suspension',
  'body_interior',
  'inspection',
  'other',
] as const;

export const ServiceCategory = v.union(
  ...ServiceCategoryValues.map((val) => v.literal(val)),
);

export type ServiceCategoryType = (typeof ServiceCategoryValues)[number];
