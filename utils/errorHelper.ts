export type ConvexClientError = Error & {
  digest?: string;
  data?: { code?: string; message?: string; details?: unknown };
};

export type ConvexErrorCode =
  | "conflict"
  | "unauthorized"
  | "not_found"
  | "forbidden"
  | "bad_request";

export function getConvexErrorMessage(unknownError: unknown): {
  message: string;
  code?: ConvexErrorCode;
  recognized: boolean;
} {
  const payload = (unknownError as ConvexClientError)?.data;
  const code = payload?.code as ConvexErrorCode | undefined;
  const message = payload?.message;
  const fallbackMessage = "Something went wrong. Please try again.";
  const isRecognized =
    code === "conflict" ||
    code === "unauthorized" ||
    code === "not_found" ||
    code === "forbidden" ||
    code === "bad_request";
  if (isRecognized) {
    return { message: message ?? fallbackMessage, code, recognized: true };
  }
  return { message: fallbackMessage, recognized: false };
}

export function setErrorFromConvexError(
  unknownError: unknown,
  setError: (msg: string) => void
): void {
  const { message } = getConvexErrorMessage(unknownError);
  console.error(message, unknownError);
  setError(message);
}
