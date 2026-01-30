import { AuditLog } from "@/types/audit-log";

export function isValidAuditLog(log: unknown): log is AuditLog {
  return (
    typeof log === "object" &&
    log !== null &&
    typeof (log as AuditLog).id === "string" &&
    typeof (log as AuditLog).action === "string" &&
    typeof (log as AuditLog).createdAt === "string" &&
    typeof (log as AuditLog).user === "object" &&
    (log as AuditLog).user !== null &&
    typeof (log as AuditLog).intake === "object" &&
    (log as AuditLog).intake !== null
  );
}

export function validateAuditLogs(logs: unknown[]): AuditLog[] {
  return logs.filter(isValidAuditLog);
}

export function sanitizeString(input: string): string {
  return input.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
}
