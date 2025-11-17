"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { setErrorFromConvexError } from "utils/errorHelper";
import { ValidatePromoCodeResult } from "@/convex/subscriptions";
import { ValidatePromoCodeInput } from "types";

export const useValidatePromoCode = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validatePromoCodeMutation = useAction(
    api.subscriptions.validatePromoCode
  );

  const validatePromoCode = async (
    input: ValidatePromoCodeInput
  ): Promise<ValidatePromoCodeResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      return await validatePromoCodeMutation(input);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    validatePromoCode,
    isLoading,
    error,
    setError,
  };
};
