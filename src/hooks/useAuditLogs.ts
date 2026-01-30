import { useEffect, useState, useCallback, useRef } from "react";
import { AuditLog, AuditLogResponse } from "@/types/audit-log";
import { validateAuditLogs } from "@/utils/audit-log";

interface UseAuditLogsOptions {
  intakeId?: string;
}

interface UseAuditLogsResult {
  auditLogs: AuditLog[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAuditLogs({ intakeId }: UseAuditLogsOptions = {}): UseAuditLogsResult {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      setLoading(true);
      setError(null);

      const url = intakeId 
        ? `/api/audit-logs?intakeId=${encodeURIComponent(intakeId)}`
        : "/api/audit-logs";

      const response = await fetch(url, { signal: abortController.signal });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Unauthorized access. Please log in again.");
        }
        if (response.status >= 500) {
          throw new Error("Server error. Please try again later.");
        }
        throw new Error(`Failed to fetch audit logs (${response.status})`);
      }

      const data: AuditLogResponse = await response.json();
      if (!data?.auditLogs) {
        throw new Error("Invalid response format");
      }

      setAuditLogs(validateAuditLogs(data.auditLogs));
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      const errorMessage = err instanceof Error ? err.message : "Failed to load audit logs";
      setError(errorMessage);
      console.error("Failed to fetch audit logs:", errorMessage);
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  }, [intakeId]);

  useEffect(() => {
    fetchAuditLogs();
    return () => abortControllerRef.current?.abort();
  }, [fetchAuditLogs]);

  return { auditLogs, loading, error, refetch: fetchAuditLogs };
}
