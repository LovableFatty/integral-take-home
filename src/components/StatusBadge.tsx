import { IntakeStatus } from "@prisma/client";
import { STATUS_CONFIG, getStatusLabel } from "@/utils/status";

interface StatusBadgeProps {
  status: IntakeStatus;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.badge.bgColor} ${config.badge.textColor} ${config.badge.borderColor} ${className}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
