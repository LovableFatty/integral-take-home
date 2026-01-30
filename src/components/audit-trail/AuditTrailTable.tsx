import { AuditLog } from "@/types/audit-log";
import AuditLogTableRow from "./AuditLogTableRow";

interface AuditTrailTableProps {
  auditLogs: AuditLog[];
  showIntakeColumn: boolean;
}

export default function AuditTrailTable({ 
  auditLogs, 
  showIntakeColumn 
}: AuditTrailTableProps) {
  return (
    <div className="overflow-x-auto" role="region" aria-label="Audit trail table">
      <table className="w-full" aria-label="Audit logs">
        <thead>
          <tr className="border-b border-gray-200">
            <th
              scope="col"
              className="text-left py-3 px-4 text-sm font-semibold text-gray-900"
            >
              Timestamp
            </th>
            <th
              scope="col"
              className="text-left py-3 px-4 text-sm font-semibold text-gray-900"
            >
              Action
            </th>
            <th
              scope="col"
              className="text-left py-3 px-4 text-sm font-semibold text-gray-900"
            >
              User
            </th>
            {showIntakeColumn && (
              <th
                scope="col"
                className="text-left py-3 px-4 text-sm font-semibold text-gray-900"
              >
                Intake
              </th>
            )}
            <th
              scope="col"
              className="text-left py-3 px-4 text-sm font-semibold text-gray-900"
            >
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {auditLogs.map((log) => (
            <AuditLogTableRow 
              key={log.id} 
              log={log} 
              showIntakeColumn={showIntakeColumn}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
