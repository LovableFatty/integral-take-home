export function getDocumentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    MEDICAL_RECORD: "Medical Record",
    INSURANCE_CARD: "Insurance Card",
    PRESCRIPTION: "Prescription",
    ID: "ID",
    OTHER: "Other",
  };
  return labels[type] || type;
}
