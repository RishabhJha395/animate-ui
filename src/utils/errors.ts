export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const maybeError = error as {
      message?: unknown;
      error_description?: unknown;
      details?: unknown;
      hint?: unknown;
      code?: unknown;
    };

    const parts = [
      maybeError.message,
      maybeError.details,
      maybeError.hint,
      maybeError.error_description,
      maybeError.code ? `Code: ${String(maybeError.code)}` : undefined,
    ].filter((part): part is string => typeof part === "string" && part.length > 0);

    if (parts.length) return parts.join(" ");
  }

  if (typeof error === "string") return error;
  return fallback;
}
