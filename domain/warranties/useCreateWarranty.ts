"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "utils/errorHelper";
import { CreateWarrantyInput } from "types";

export const useCreateWarranty = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createWarrantyMutation = useMutation(api.warranties.insertWarranty);

  const createWarranty = async (
    input: CreateWarrantyInput
  ): Promise<Id<"warranties"> | null> => {
    setIsLoading(true);
    setError(null);

    try {
      return await createWarrantyMutation(input);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createWarranty,
    isLoading,
    error,
    setError,
  };
};
