import { formatKey } from "@/utils/format";
import { sanitizeString } from "@/utils/audit-log";

interface AuditLogDetailsProps {
  details: string | null;
}

export default function AuditLogDetails({ details }: AuditLogDetailsProps) {
  if (!details) return null;

  try {
    const parsed = JSON.parse(details);
    const entries = Object.entries(parsed);
    
    if (entries.length === 0) {
      return <span className="text-gray-400 italic">No details</span>;
    }

    return (
      <ul className="list-disc list-inside space-y-1 text-left">
        {entries.map(([key, value]) => (
          <li key={key} className="text-xs">
            <span className="font-medium text-gray-900">{formatKey(key)}:</span>{" "}
            <span className="text-gray-700">{value == null ? "N/A" : String(value)}</span>
          </li>
        ))}
      </ul>
    );
  } catch {
    return <span className="text-xs text-gray-700">{sanitizeString(details)}</span>;
  }
}
