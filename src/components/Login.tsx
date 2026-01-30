"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginResponse {
  user?: {
    id: string;
    email: string;
    name: string;
    role: "PATIENT" | "REVIEWER";
    organization: string;
  };
  error?: string;
}

type Role = "PATIENT" | "REVIEWER";

export default function Login() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>("PATIENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      if (data.user) {
        if (data.user.role !== selectedRole) {
          setError(`Please sign in as a ${selectedRole === "PATIENT" ? "Patient" : "Reviewer"}`);
          setLoading(false);
          return;
        }

        if (data.user.role === "PATIENT") {
          router.push("/intake");
        } else if (data.user.role === "REVIEWER") {
          router.push("/queue");
        } else {
          router.push("/");
        }

        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        Sign In
      </h2>
      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
        Choose your role to continue
      </p>

      <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 p-1 bg-gray-100 rounded-lg">
        <button
          type="button"
          onClick={() => setSelectedRole("PATIENT")}
          className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 rounded-md font-medium transition-all text-xs sm:text-sm ${
            selectedRole === "PATIENT"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="hidden sm:inline">Client</span>
          <span className="sm:hidden">Client</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedRole("REVIEWER")}
          className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 rounded-md font-medium transition-all text-xs sm:text-sm ${
            selectedRole === "REVIEWER"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span className="hidden sm:inline">Reviewer</span>
          <span className="sm:hidden">Reviewer</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            placeholder={selectedRole === "PATIENT" ? "client@example.com" : "reviewer@example.com"}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
        >
          {loading
            ? "Signing in..."
            : `Sign in as ${selectedRole === "PATIENT" ? "Client" : "Reviewer"}`}
        </button>

        <p className="text-xs sm:text-sm text-gray-500 text-center mt-3 sm:mt-4">
          {selectedRole === "PATIENT"
            ? "Submit and track your intake applications"
            : "Review and manage intake applications"}
        </p>
      </form>
    </div>
  );
}
