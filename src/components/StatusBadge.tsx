import { IntakeStatus } from "@prisma/client";

interface StatusBadgeProps {
  status: IntakeStatus;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const statusConfig = {
    PENDING: {
      label: "Pending",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-300",
    },
    IN_REVIEW: {
      label: "In Review",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-300",
    },
    APPROVED: {
      label: "Approved",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-300",
    },
    REJECTED: {
      label: "Rejected",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-300",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
    >
      {config.label}
    </span>
  );
}
