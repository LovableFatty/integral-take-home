"use client";

import { useRouter } from "next/navigation";

interface IntakeSuccessProps {
  intakeId: string | null;
  onReset: () => void;
}

export default function IntakeSuccess({ intakeId, onReset }: IntakeSuccessProps) {
  const router = useRouter();
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
            onClick={onReset}
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
