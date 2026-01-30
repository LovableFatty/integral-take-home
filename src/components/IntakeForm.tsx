"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface IntakeFormProps {
  userId: string;
}

interface IntakeFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  dateOfBirth: string;
  ssn: string;
  fullAddress: string;
  description: string;
  notes: string;
}

export default function IntakeForm({ userId }: IntakeFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<IntakeFormData>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    dateOfBirth: "",
    ssn: "",
    fullAddress: "",
    description: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [intakeId, setIntakeId] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string | null => {
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
  };

  const formatSSN = (value: string): string => {
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
  };

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSSN(e.target.value);
    setFormData((prev) => ({ ...prev, ssn: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify({ ...formData, userId }));

      const response = await fetch("/api/intakes", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setSuccess(true);
      setIntakeId(data.intake?.id || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const referenceNumber = intakeId
      ? `INT-${intakeId.slice(-6).toUpperCase()}`
      : "INT-000000";

    return (
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="h-6 w-6 sm:h-8 sm:h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            Application Submitted Successfully
          </h2>

          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Your enrollment application has been received and is now pending review.
            You will be notified once a reviewer processes your submission.
          </p>

          <div className="mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-gray-500 mb-2">Reference Number</p>
            <div className="bg-gray-100 rounded-md px-3 sm:px-4 py-2 sm:py-3">
              <p className="text-sm sm:text-base font-bold text-gray-900">{referenceNumber}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  clientName: "",
                  clientEmail: "",
                  clientPhone: "",
                  dateOfBirth: "",
                  ssn: "",
                  fullAddress: "",
                  description: "",
                  notes: "",
                });
                setIntakeId(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors font-medium text-sm sm:text-base"
            >
              Submit Another
            </button>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors font-medium text-sm sm:text-base"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        Enrollment Application
      </h2>
      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
        Please fill out all required fields to submit your enrollment application.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Personal Information
          </h3>

          <div>
            <label
              htmlFor="clientName"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="clientName"
              name="clientName"
              type="text"
              value={formData.clientName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="clientEmail"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="clientEmail"
                name="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                placeholder="john.doe@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="clientPhone"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="clientPhone"
                name="clientPhone"
                type="tel"
                value={formData.clientPhone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="ssn"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                Social Security Number <span className="text-red-500">*</span>
              </label>
              <input
                id="ssn"
                name="ssn"
                type="text"
                value={formData.ssn}
                onChange={handleSSNChange}
                required
                maxLength={11}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                placeholder="XXX-XX-XXXX"
              />
            </div>

            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="fullAddress"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
            >
              Full Address <span className="text-red-500">*</span>
            </label>
            <input
              id="fullAddress"
              name="fullAddress"
              type="text"
              value={formData.fullAddress}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              placeholder="123 Main St, City, State ZIP"
            />
          </div>
        </div>

        {/* Application Details Section */}
        <div className="space-y-4">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Application Details
          </h3>

          <div>
            <label
              htmlFor="description"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
            >
              Reason for Enrollment / Medical History <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              placeholder="Please describe your reason for enrollment and relevant medical history..."
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
            >
              Additional Notes <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              placeholder="Any additional information you'd like to provide..."
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
}
