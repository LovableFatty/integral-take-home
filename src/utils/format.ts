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
  if (!id || typeof id !== "string") {
    return "INT-INVALID";
  }
  const prefix = id.length >= 8 ? id.substring(0, 8).toUpperCase() : id.toUpperCase();
  return `INT-${prefix}`;
}

export function formatTimestamp(dateString: string): string {
  if (!dateString) return "Invalid date";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch {
    return "Invalid date";
  }
}

export function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export function formatSSN(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
}
