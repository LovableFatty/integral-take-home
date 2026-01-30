"use client";

import { useEffect, useState, useCallback } from "react";
import StatusSummaryCards from "./StatusSummaryCards";
import IntakeDetailDialog from "./IntakeDetailDialog";
import IntakeFilters from "./IntakeFilters";
import IntakeTable from "./IntakeTable";
import Card from "./Card";
import { IntakeStatus } from "@prisma/client";
import { IntakeWithRelations, GetIntakesResponse } from "@/types/intake";
import { filterIntakes } from "@/utils/filters";

export default function QueueList() {
  const [intakes, setIntakes] = useState<IntakeWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<IntakeStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIntakeId, setSelectedIntakeId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchIntakes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/intakes");
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please log in.");
        }
        throw new Error("Failed to fetch intakes");
      }
      const data: GetIntakesResponse = await response.json();
      setIntakes(data.intakes || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIntakes();
  }, [fetchIntakes]);

  const filteredIntakes = filterIntakes(intakes, statusFilter, searchQuery);

  const handleViewClick = (intakeId: string) => {
    setSelectedIntakeId(intakeId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedIntakeId(null);
  };

  if (loading) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading applications...</p>
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
            onClick={fetchIntakes}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Summary Cards */}
      <StatusSummaryCards intakes={intakes} />

      {/* Intake Submissions Section */}
      <Card>
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Intake Submissions
              <span className="ml-2 text-sm font-normal text-gray-500">
                {filteredIntakes.length} intake{filteredIntakes.length !== 1 ? "s" : ""} found
              </span>
            </h2>

            <IntakeFilters
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              onSearchChange={setSearchQuery}
              onStatusChange={setStatusFilter}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Reviewer
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <IntakeTable intakes={filteredIntakes} onViewClick={handleViewClick} />
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Intake Detail Dialog */}
      <IntakeDetailDialog
        intakeId={selectedIntakeId}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onStatusUpdate={fetchIntakes}
      />
    </div>
  );
}
