export interface IntakeFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  dateOfBirth: string;
  ssn: string;
  fullAddress: string;
  description: string;
  notes: string;
}

/**
 * Validates intake form data and returns an error message if validation fails
 * @param formData - The form data to validate
 * @returns Error message string or null if validation passes
 */
export function validateIntakeForm(formData: IntakeFormData): string | null {
  if (!formData.clientName.trim()) {
    return "Full name is required";
  }
  if (!formData.clientEmail.trim()) {
    return "Email is required";
  }
  if (!formData.clientPhone.trim()) {
    return "Phone number is required";
  }
  if (!formData.dateOfBirth.trim()) {
    return "Date of birth is required";
  }
  if (!formData.ssn.trim()) {
    return "Social Security Number is required";
  }
  if (!formData.fullAddress.trim()) {
    return "Full address is required";
  }
  if (!formData.description.trim()) {
    return "Description is required";
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.clientEmail)) {
    return "Please enter a valid email address";
  }

  // Validate phone format (basic)
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  if (!phoneRegex.test(formData.clientPhone)) {
    return "Please enter a valid phone number";
  }

  // Validate SSN format (XXX-XX-XXXX)
  const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
  if (!ssnRegex.test(formData.ssn)) {
    return "SSN must be in format XXX-XX-XXXX";
  }

  return null;
}

/**
 * Formats a string value as a Social Security Number (XXX-XX-XXXX)
 * @param value - The input value to format
 * @returns Formatted SSN string
 */
export function formatSSN(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");
  
  // Format as XXX-XX-XXXX
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 5) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else {
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
  }
}
