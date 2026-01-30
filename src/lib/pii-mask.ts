/**
 * Utility functions for masking PII (Personally Identifiable Information)
 * Used to protect sensitive data in redacted views
 */

export type PIIType = "phone" | "ssn" | "dob" | "address" | "email";

/**
 * Masks PII based on the type
 */
export function maskPII(
  value: string,
  type: PIIType,
  showMonthDay: boolean = false
): string {
  if (!value) return "";

  switch (type) {
    case "phone":
    case "ssn": {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length < 4) return value;
      const last4 = cleaned.slice(-4);
      return type === "phone" ? `***-***-${last4}` : `***-**-${last4}`;
    }

    case "dob":
      return showMonthDay
        ? value.replace(/^\d{4}/, "****")
        : value.split("-").length === 3
          ? `${value.split("-")[0]}-**-**`
          : value;

    case "address": {
      const parts = value.split(",");
      if (parts.length >= 2) return `***, ${parts.slice(-2).join(", ")}`;
      return value.length > 10 ? `***${value.slice(-10)}` : "***";
    }

    case "email": {
      const atIndex = value.indexOf("@");
      return atIndex === -1 ? value : `***${value.slice(atIndex)}`;
    }

    default:
      return value;
  }
}
