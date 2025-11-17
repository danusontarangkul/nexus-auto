"use client";

import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { RegistrationWithReceipts } from "types";

export const useRegistration = (
  vehicleId: Id<"vehicles">
): RegistrationWithReceipts | undefined => {
  return useQuery<
    typeof api.registrations.getRegistrationWithReceiptsByVehicleId
  >(api.registrations.getRegistrationWithReceiptsByVehicleId, {
    vehicleId,
  });
};
