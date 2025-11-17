"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { setErrorFromConvexError } from "utils/errorHelper";
import {
  CheckOrRestoreSubscriptionInput,
  CheckOrRestoreSubscriptionResult,
} from "types";

export const useCheckOrRestoreSubscription = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkOrRestoreSubscriptionMutation = useAction(
    api.subscriptions.checkOrRestoreSubscription
  );

  const checkOrRestoreSubscription = async (
    input: CheckOrRestoreSubscriptionInput
  ): Promise<CheckOrRestoreSubscriptionResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      return await checkOrRestoreSubscriptionMutation(input);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkOrRestoreSubscription,
    isLoading,
    error,
    setError,
  };
};
