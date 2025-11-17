"use client";

import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { ServiceRecordWithReceipts } from "types";

export const useServiceRecord = (
  serviceRecordId: Id<"serviceRecords">
): ServiceRecordWithReceipts | undefined => {
  return useQuery<typeof api.serviceRecords.getServiceRecordById>(
    api.serviceRecords.getServiceRecordById,
    {
      serviceRecordId,
    }
  );
};
