"use client";

import { useEffect, useState } from "react";
import StatusHeader from "./StatusHeader";
import Dialog from "./Dialog";
import PrivilegedViewToggle from "./PrivilegedViewToggle";
import PersonalInformationSection from "./PersonalInformationSection";
import ApplicationDetailsSection from "./ApplicationDetailsSection";
import DocumentsSection from "./DocumentsSection";
import SubmissionInformationSection from "./SubmissionInformationSection";
import { IntakeDetail } from "@/types/intake";
import { formatDateTime } from "@/utils/format";
import { IntakeStatus } from "@prisma/client";
import { getErrorMessage } from "@/utils/errors";

interface IntakeDetailDialogProps {
  intakeId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: () => void;
}

export default function IntakeDetailDialog({
  intakeId,
  isOpen,
  onClose,
  onStatusUpdate,
}: IntakeDetailDialogProps) {
  const [intake, setIntake] = useState<IntakeDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [privileged, setPrivileged] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState("");
  const [hasLoggedPrivilegedView, setHasLoggedPrivilegedView] = useState(false);

  useEffect(() => {
    if (isOpen && intakeId) {
      fetchIntakeDetail();
    } else if (!isOpen) {
      setIntake(null);
      setPrivileged(false);
      setError("");
      setStatusUpdateError("");
      setHasLoggedPrivilegedView(false);
    }
  }, [isOpen, intakeId]);

  // Log privileged view access when toggled ON (only once per dialog session)
  useEffect(() => {
    if (privileged && intakeId && intake && !hasLoggedPrivilegedView) {
      const logPrivilegedView = async () => {
        try {
          await fetch(`/api/intakes/${intakeId}/view`, {
            method: "POST",
          });
          setHasLoggedPrivilegedView(true);
        } catch (err) {
          console.error("Failed to log privileged view access:", err);
        }
      };
      logPrivilegedView();
    }
  }, [privileged, intakeId, intake, hasLoggedPrivilegedView]);

  const fetchIntakeDetail = async () => {
    if (!intakeId) return;

    try {
      setLoading(true);
      setError("");
      const response = await fetch(`/api/intakes/${intakeId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Intake not found");
        }
        if (response.status === 403) {
          throw new Error("You don't have permission to view this intake");
        }
        throw new Error("Failed to fetch intake details");
      }
      const data = await response.json();
      setIntake(data.intake);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load intake details"));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (documentId: string) => {
    // TODO: Implement download logic for individual document
    console.log("Download document:", documentId);
  };

  const handleDownloadAll = () => {
    // TODO: Implement download all logic
    console.log("Download all documents");
  };

  const handleStatusUpdate = async (newStatus: IntakeStatus) => {
    if (!intakeId || !intake) return;

    try {
      setUpdatingStatus(true);
      setStatusUpdateError("");

      const response = await fetch(`/api/intakes/${intakeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          notes: intake.notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update status");
      }

      const data = await response.json();
      
      setIntake(data.intake);
      
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (err) {
      setStatusUpdateError(getErrorMessage(err, "Failed to update status"));
    } finally {
      setUpdatingStatus(false);
    }
  };


  if (!intakeId) {
    return null;
  }

  const showPrivilegedToggle = true;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Intake Application Details"
      subtitle={
        intake ? `Submitted ${formatDateTime(intake.createdAt)}` : undefined
      }
      headerActions={
        showPrivilegedToggle && intake ? (
          <PrivilegedViewToggle
            privileged={privileged}
            onToggle={setPrivileged}
          />
        ) : undefined
      }
      footer={
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      }
    >
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading intake details...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchIntakeDetail}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      ) : intake ? (
        <div className="space-y-6">
          {/* Status Badge and Update Controls */}
          <StatusHeader
            status={intake.status}
            onStatusUpdate={handleStatusUpdate}
            updatingStatus={updatingStatus}
            statusUpdateError={statusUpdateError}
          />

          {/* Personal Information Section */}
          <PersonalInformationSection
            clientName={intake.clientName}
            clientEmail={intake.clientEmail}
            clientPhone={intake.clientPhone}
            dateOfBirth={intake.dateOfBirth}
            ssn={intake.ssn}
            fullAddress={intake.fullAddress}
            privileged={privileged}
          />

          {/* Application Details Section */}
          <ApplicationDetailsSection
            description={intake.description}
            notes={intake.notes}
          />

          {/* Documents Section */}
          <DocumentsSection
            documents={intake.documents}
            onDownload={handleDownload}
            onDownloadAll={handleDownloadAll}
          />

          {/* Submission Information */}
          <SubmissionInformationSection
            submittedBy={intake.submittedBy}
            reviewer={intake.reviewer}
          />
        </div>
      ) : null}
    </Dialog>
  );
}
