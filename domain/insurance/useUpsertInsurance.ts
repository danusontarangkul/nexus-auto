"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { setErrorFromConvexError } from "utils/errorHelper";
import { UpsertInsuranceInput } from "types";

export const useUpsertInsurance = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const upsertInsuranceMutation = useMutation(api.insurance.upsertInsurance);

  const upsertRegistration = async (
    input: UpsertInsuranceInput
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await upsertInsuranceMutation(input);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    upsertRegistration,
    isLoading,
    error,
    setError,
  };
};
