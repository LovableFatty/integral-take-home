export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatIntakeId(id: string): string {
  return `INT-${id.substring(0, 8).toUpperCase()}`;
}
