export interface AuditLog {
  id: string;
  action: string;
  details: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  intake: {
    id: string;
    clientName: string;
    status: string;
  };
}

export interface AuditLogResponse {
  auditLogs: AuditLog[];
}
