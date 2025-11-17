import { v } from "convex/values";

export const ReceiptStatus = v.union(
  v.literal("draft"),
  v.literal("parsing"),
  v.literal("ready"),
  v.literal("parsed"),
  v.literal("failed"),
  v.literal("abandoned")
);

export const ReceiptType = v.union(
  v.literal("insurance"),
  v.literal("registration"),
  v.literal("warranty"),
  v.literal("service"),
  v.literal("other")
);
