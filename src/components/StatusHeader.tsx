"use client";

import { IntakeStatus } from "@prisma/client";
import StatusBadge from "./StatusBadge";
import { getNextStatusOptions, getStatusButtonLabel, STATUS_CONFIG } from "@/utils/status";

interface StatusHeaderProps {
  status: IntakeStatus;
  onStatusUpdate: (newStatus: IntakeStatus) => void;
  updatingStatus: boolean;
  statusUpdateError: string;
}

export default function StatusHeader({
  status,
  onStatusUpdate,
  updatingStatus,
  statusUpdateError,
}: StatusHeaderProps) {
  const statusOptions = getNextStatusOptions(status);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Status:</span>
        <StatusBadge status={status} />
      </div>
      
      {/* Status Update Controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        {statusUpdateError && (
          <p className="text-xs text-red-600">{statusUpdateError}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((optionStatus) => {
            const buttonConfig = STATUS_CONFIG[optionStatus].button;
            return (
              <button
                key={optionStatus}
                onClick={() => onStatusUpdate(optionStatus)}
                disabled={updatingStatus}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                  updatingStatus
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                } ${buttonConfig.bgColor} ${buttonConfig.textColor} ${buttonConfig.borderColor}`}
              >
                {getStatusButtonLabel(optionStatus)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
