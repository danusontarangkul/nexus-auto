"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { setErrorFromConvexError } from "utils/errorHelper";
import { CreateReceiptInput } from "types";

export const useCreateReceipt = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createReceiptMutation = useAction(api.receipts.insertReceipt);

  const createReceipt = async (input: CreateReceiptInput): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await createReceiptMutation(input);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createReceipt,
    isLoading,
    error,
    setError,
  };
};
