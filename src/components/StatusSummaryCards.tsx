"use client";

import { IntakeStatus } from "@prisma/client";
import { STATUS_CONFIG, getStatusLabel } from "@/utils/status";

interface StatusSummaryCardsProps {
  intakes: Array<{ status: IntakeStatus }>;
}

export default function StatusSummaryCards({ intakes }: StatusSummaryCardsProps) {
  const counts = {
    PENDING: intakes.filter((i) => i.status === "PENDING").length,
    IN_REVIEW: intakes.filter((i) => i.status === "IN_REVIEW").length,
    APPROVED: intakes.filter((i) => i.status === "APPROVED").length,
    REJECTED: intakes.filter((i) => i.status === "REJECTED").length,
  };

  const cards = [
    {
      status: "PENDING" as IntakeStatus,
      label: getStatusLabel("PENDING"),
      count: counts.PENDING,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      ...STATUS_CONFIG.PENDING.summary,
    },
    {
      status: "IN_REVIEW" as IntakeStatus,
      label: getStatusLabel("IN_REVIEW"),
      count: counts.IN_REVIEW,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      ...STATUS_CONFIG.IN_REVIEW.summary,
    },
    {
      status: "APPROVED" as IntakeStatus,
      label: getStatusLabel("APPROVED"),
      count: counts.APPROVED,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      ...STATUS_CONFIG.APPROVED.summary,
    },
    {
      status: "REJECTED" as IntakeStatus,
      label: getStatusLabel("REJECTED"),
      count: counts.REJECTED,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      ...STATUS_CONFIG.REJECTED.summary,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.status}
          className={`${card.bgColor} rounded-lg p-4 border border-gray-200`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`${card.iconColor}`}>{card.icon}</div>
          </div>
          <div className={`text-2xl font-bold ${card.textColor}`}>{card.count}</div>
          <div className={`text-sm font-medium ${card.textColor} opacity-80`}>
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
}
