import { AuditLog } from "@/types/audit-log";
import ActionBadge from "../ActionBadge";
import AuditLogDetails from "./AuditLogDetails";
import { formatTimestamp, formatIntakeId } from "@/utils/format";

interface AuditLogTableRowProps {
  log: AuditLog;
  showIntakeColumn: boolean;
}

const CELL_CLASS = "py-3 px-4";

export default function AuditLogTableRow({ log, showIntakeColumn }: AuditLogTableRowProps) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className={CELL_CLASS}>
        <time dateTime={log.createdAt} className="font-mono text-sm text-gray-900">
          {formatTimestamp(log.createdAt)}
        </time>
      </td>

      <td className={CELL_CLASS}>
        <ActionBadge action={log.action} />
      </td>

      <td className={CELL_CLASS}>
        <div className="text-sm">
          <div className="font-medium text-gray-900">{log.user?.name ?? "Unknown"}</div>
          <div className="text-gray-500 text-xs">{log.user?.email ?? "No email"}</div>
        </div>
      </td>

      {showIntakeColumn && (
        <td className={CELL_CLASS}>
          <div className="text-sm">
            <div className="font-medium text-gray-900">{formatIntakeId(log.intake?.id ?? "")}</div>
            <div className="text-gray-500 text-xs">{log.intake?.clientName ?? "Unknown"}</div>
          </div>
        </td>
      )}

      <td className={CELL_CLASS}>
        {log.details ? (
          <div className="text-xs bg-gray-50 p-3 rounded border border-gray-200 max-w-md">
            <AuditLogDetails details={log.details} />
          </div>
        ) : (
          <span className="text-sm text-gray-400 italic">No details</span>
        )}
      </td>
    </tr>
  );
}
