/**
 * Extract error message from unknown error type
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  return error instanceof Error && error.message === "Unauthorized";
}

/**
 * Check if error is a forbidden error
 */
export function isForbiddenError(error: unknown): boolean {
  return error instanceof Error && error.message === "Forbidden";
}
