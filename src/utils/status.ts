import { IntakeStatus } from "@prisma/client";

/**
 * Centralized status configuration
 * Single source of truth for status labels, colors, and styling
 */
export const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    badge: {
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-300",
    },
    button: {
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-300",
      label: "Reset to Pending",
    },
    summary: {
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-900",
    },
  },
  IN_REVIEW: {
    label: "In Review",
    badge: {
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-300",
    },
    button: {
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-300",
      label: "Mark In Review",
    },
    summary: {
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      textColor: "text-blue-900",
    },
  },
  APPROVED: {
    label: "Approved",
    badge: {
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-300",
    },
    button: {
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-300",
      label: "Approve",
    },
    summary: {
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      textColor: "text-green-900",
    },
  },
  REJECTED: {
    label: "Rejected",
    badge: {
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-300",
    },
    button: {
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-300",
      label: "Reject",
    },
    summary: {
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      textColor: "text-red-900",
    },
  },
} as const;

/**
 * Get the next available status options based on current status
 */
export function getNextStatusOptions(currentStatus: IntakeStatus): IntakeStatus[] {
  switch (currentStatus) {
    case "PENDING":
      return ["IN_REVIEW", "APPROVED", "REJECTED"];
    case "IN_REVIEW":
      return ["APPROVED", "REJECTED", "PENDING"];
    case "APPROVED":
      return ["REJECTED", "IN_REVIEW"];
    case "REJECTED":
      return ["PENDING", "IN_REVIEW"];
    default:
      return [];
  }
}

/**
 * Get status label
 */
export function getStatusLabel(status: IntakeStatus): string {
  return STATUS_CONFIG[status].label;
}

/**
 * Get status button label
 */
export function getStatusButtonLabel(status: IntakeStatus): string {
  return STATUS_CONFIG[status].button.label;
}
