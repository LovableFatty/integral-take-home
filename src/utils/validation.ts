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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-\(\)]+$/;
const SSN_REGEX = /^\d{3}-\d{2}-\d{4}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validateIntakeForm(formData: IntakeFormData): string | null {
  if (!formData.clientName.trim()) return "Full name is required";
  if (!formData.clientEmail.trim()) return "Email is required";
  if (!formData.clientPhone.trim()) return "Phone number is required";
  if (!formData.dateOfBirth.trim()) return "Date of birth is required";
  if (!formData.ssn.trim()) return "Social Security Number is required";
  if (!formData.fullAddress.trim()) return "Full address is required";
  if (!formData.description.trim()) return "Description is required";

  if (!isValidEmail(formData.clientEmail)) {
    return "Please enter a valid email address";
  }

  if (!PHONE_REGEX.test(formData.clientPhone)) {
    return "Please enter a valid phone number";
  }

  if (!SSN_REGEX.test(formData.ssn)) {
    return "SSN must be in format XXX-XX-XXXX";
  }

  return null;
}
