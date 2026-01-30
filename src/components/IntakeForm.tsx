"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateIntakeForm, type IntakeFormData } from "@/utils/validation";
import { formatSSN } from "@/utils/format";
import IntakeSuccess from "./IntakeSuccess";
import FileUploadSection, { getFileKey } from "./FileUploadSection";

interface IntakeFormProps {
  userId: string;
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
  const [files, setFiles] = useState<File[]>([]);
  const [fileTypes, setFileTypes] = useState<Record<string, string>>({});
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

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSSN(e.target.value);
    setFormData((prev) => ({ ...prev, ssn: formatted }));
  };

  const handleReset = () => {
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
    setFiles([]);
    setFileTypes({});
    setIntakeId(null);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateIntakeForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify({ ...formData, userId }));

      files.forEach((file, index) => {
        formDataToSend.append("files", file);
        const fileKey = getFileKey(file, index);
        formDataToSend.append("fileTypes", fileTypes[fileKey] || "OTHER");
      });

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
    return <IntakeSuccess intakeId={intakeId} onReset={handleReset} />;
  }

  return (
    <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
      {/* Back Button */}
      <button
        onClick={() => router.push("/login")}
        className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        aria-label="Back to login"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Login
      </button>

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

        {/* Document Upload Section */}
        <FileUploadSection
          files={files}
          fileTypes={fileTypes}
          onFilesChange={setFiles}
          onFileTypesChange={setFileTypes}
        />

        <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => router.push("/login")}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 sm:py-3 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
          >
            Cancel Application
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:flex-1 bg-gray-900 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
}
