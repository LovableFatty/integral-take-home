import StatusBadge from "./StatusBadge";
import { formatDateTime, formatIntakeId } from "@/utils/format";
import { IntakeWithRelations } from "@/types/intake";

interface IntakeTableProps {
  intakes: IntakeWithRelations[];
  onViewClick: (id: string) => void;
}

// TODO: Add pagination support for large datasets
// - Add page/pageSize props or use virtual scrolling
// - Consider server-side pagination with API support
export default function IntakeTable({ intakes, onViewClick }: IntakeTableProps) {
  if (intakes.length === 0) {
    return (
      <tr>
        <td colSpan={7} className="py-8 text-center text-gray-500">
          No applications found
        </td>
      </tr>
    );
  }

  return (
    <>
      {intakes.map((intake) => (
        <tr
          key={intake.id}
          className="hover:bg-gray-50 transition-colors"
        >
          <td className="py-3 px-4 text-sm text-gray-900 font-mono">
            {formatIntakeId(intake.id)}
          </td>
          <td className="py-3 px-4 text-sm text-gray-900">
            {intake.clientName}
          </td>
          <td className="py-3 px-4 text-sm text-gray-600">
            {intake.clientEmail}
          </td>
          <td className="py-3 px-4 text-sm text-gray-600">
            {formatDateTime(intake.createdAt)}
          </td>
          <td className="py-3 px-4">
            <StatusBadge status={intake.status} />
          </td>
          <td className="py-3 px-4 text-sm text-gray-600">
            {intake.reviewer ? intake.reviewer.name : "—"}
          </td>
          <td className="py-3 px-4">
            <button
              onClick={() => onViewClick(intake.id)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}
