"use client";

import Card from "./Card";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import AuditTrailTable from "./audit-trail/AuditTrailTable";

interface AuditTrailListProps {
  intakeId?: string;
}

export default function AuditTrailList({ intakeId }: AuditTrailListProps) {
  const { auditLogs, loading, error, refetch } = useAuditLogs({ intakeId });

  if (loading) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
          <p className="text-gray-600">Loading audit logs...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  if (auditLogs.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-600">
            {intakeId 
              ? "No audit logs found for this intake."
              : "No audit logs found. Actions will appear here once they are recorded."}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <AuditTrailTable 
        auditLogs={auditLogs} 
        showIntakeColumn={!intakeId}
      />
    </Card>
  );
}
