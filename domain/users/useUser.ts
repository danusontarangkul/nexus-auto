"use client";

import { useQuery } from "convex/react";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

export const useUser = (): Doc<"users"> | undefined => {
  return useQuery<typeof api.users.getUserById>(api.users.getUserById, {});
};
