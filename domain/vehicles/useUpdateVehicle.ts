"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { setErrorFromConvexError } from "utils/errorHelper";
import { UpdateVehicleInput } from "types";

export const useUpdateVehicle = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateVehicleMutation = useMutation(api.vehicles.updateVehicle);

  const updateVehicle = async (input: UpdateVehicleInput): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await updateVehicleMutation(input);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateVehicle,
    isLoading,
    error,
    setError,
  };
};
