export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateOfBirth(dateString: string, isPrivileged: boolean): string {
  const formatted = formatDate(dateString);
  if (isPrivileged) {
    return formatted;
  }
  return formatted.replace(/^[A-Za-z]+\s+\d+/, "**** **");
}

export function formatIntakeId(id: string): string {
  return `INT-${id.substring(0, 8).toUpperCase()}`;
}
