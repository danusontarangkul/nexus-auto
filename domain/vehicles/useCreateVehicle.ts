"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { setErrorFromConvexError } from "utils/errorHelper";
import { CreateVehicleInput, DecodeVinResult } from "types";

export const useCreateVehicle = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createVehicleMutation = useAction(api.vehicles.insertVehicle);

  const createVehicle = async (
    input: CreateVehicleInput
  ): Promise<DecodeVinResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      return await createVehicleMutation(input);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createVehicle,
    isLoading,
    error,
    setError,
  };
};
