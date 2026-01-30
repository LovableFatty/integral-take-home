"use client";

import { maskPII } from "@/lib/pii-mask";

interface PIIMaskProps {
  value: string;
  type: "phone" | "ssn" | "dob" | "address" | "email";
  showPrivileged?: boolean;
  showMonthDay?: boolean;
}

export default function PIIMask({
  value,
  type,
  showPrivileged = false,
  showMonthDay = false,
}: PIIMaskProps) {
  if (showPrivileged) {
    return <span>{value}</span>;
  }

  const maskedValue = maskPII(value, type, showMonthDay);

  return <span className="font-mono">{maskedValue}</span>;
}
