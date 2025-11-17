"use client";

import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { InsuranceWithReceipts } from "types";

export const useInsurance = (
  vehicleId: Id<"vehicles">
): InsuranceWithReceipts | undefined => {
  return useQuery<typeof api.insurance.getInsuranceWithReceiptsByVehicleId>(
    api.insurance.getInsuranceWithReceiptsByVehicleId,
    {
      vehicleId,
    }
  );
};
