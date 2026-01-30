export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export function isAuthError(error: unknown): boolean {
  return error instanceof Error && error.message === "Unauthorized";
}

export function isForbiddenError(error: unknown): boolean {
  return error instanceof Error && error.message === "Forbidden";
}
